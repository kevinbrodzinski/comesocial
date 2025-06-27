
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LiveVenueUpdate {
  venue_id: number;
  crowd_level: number;
  wait_time: number;
  capacity_current: number;
  capacity_maximum: number;
  atmosphere_energy: number;
  pricing_level: string;
  has_space: boolean;
  timestamp: string;
}

interface LiveEventUpdate {
  event_id: string;
  venue_id: number;
  event_type: string;
  is_active: boolean;
  attendance: number;
  popularity: number;
  start_time: string;
  end_time: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, data } = await req.json();

    switch (action) {
      case 'sync_venue_data':
        return await syncVenueData(supabase, data);
      
      case 'sync_event_data':
        return await syncEventData(supabase, data);
      
      case 'get_live_data':
        return await getLiveData(supabase, data);
      
      case 'update_crowd_levels':
        return await updateCrowdLevels(supabase, data);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('Live data sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function syncVenueData(supabase: any, venueUpdates: LiveVenueUpdate[]) {
  try {
    console.log('Syncing venue data:', venueUpdates.length, 'updates');

    // Update venue crowd levels and basic info
    const venuePromises = venueUpdates.map(async (update) => {
      const { error: venueError } = await supabase
        .from('venues')
        .update({
          crowd_level: update.crowd_level,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.venue_id);

      if (venueError) {
        console.error('Error updating venue:', venueError);
        return { success: false, venue_id: update.venue_id, error: venueError };
      }

      // Insert venue activity record
      const { error: activityError } = await supabase
        .from('venue_activity')
        .insert({
          venue_id: update.venue_id,
          activity_date: new Date().toISOString().split('T')[0],
          hour_of_day: new Date().getHours(),
          check_in_count: Math.floor(update.crowd_level / 10), // Estimate
          total_visitors: update.capacity_current,
          average_crowd_level: update.crowd_level,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (activityError && !activityError.message?.includes('duplicate')) {
        console.error('Error inserting venue activity:', activityError);
      }

      return { success: true, venue_id: update.venue_id };
    });

    const results = await Promise.all(venuePromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Venue sync complete: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: successful,
        failed: failed,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Venue sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function syncEventData(supabase: any, eventUpdates: LiveEventUpdate[]) {
  try {
    console.log('Syncing event data:', eventUpdates.length, 'events');

    // For now, we'll store events in a JSON column in venue_activity
    // In a production app, you'd want a dedicated events table
    const eventPromises = eventUpdates.map(async (event) => {
      // Create activity feed entry for the event
      const { error } = await supabase
        .from('activity_feeds')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // System user
          activity_type: 'live_event',
          title: `Live Event at Venue ${event.venue_id}`,
          content: `${event.event_type} - ${event.attendance} people attending`,
          venue_id: event.venue_id,
          metadata: {
            event_id: event.event_id,
            event_type: event.event_type,
            attendance: event.attendance,
            popularity: event.popularity,
            start_time: event.start_time,
            end_time: event.end_time,
            is_active: event.is_active
          },
          privacy_level: 'public',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error inserting event activity:', error);
        return { success: false, event_id: event.event_id, error };
      }

      return { success: true, event_id: event.event_id };
    });

    const results = await Promise.all(eventPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Event sync complete: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: successful,
        failed: failed,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Event sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function getLiveData(supabase: any, params: { venue_ids?: number[], include_events?: boolean }) {
  try {
    console.log('Getting live data for venues:', params.venue_ids);

    let venueQuery = supabase
      .from('venues')
      .select('id, name, crowd_level, is_open_now, updated_at, latitude, longitude');

    if (params.venue_ids && params.venue_ids.length > 0) {
      venueQuery = venueQuery.in('id', params.venue_ids);
    }

    const { data: venues, error: venueError } = await venueQuery.limit(50);

    if (venueError) {
      throw new Error(`Failed to fetch venues: ${venueError.message}`);
    }

    let events = [];
    if (params.include_events) {
      // Get recent event activity
      let eventQuery = supabase
        .from('activity_feeds')
        .select('*')
        .eq('activity_type', 'live_event')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (params.venue_ids && params.venue_ids.length > 0) {
        eventQuery = eventQuery.in('venue_id', params.venue_ids);
      }

      const { data: eventData, error: eventError } = await eventQuery.limit(100);
      
      if (eventError) {
        console.error('Error fetching events:', eventError);
      } else {
        events = eventData || [];
      }
    }

    // Get venue activity for trend analysis
    const { data: activity, error: activityError } = await supabase
      .from('venue_activity')
      .select('venue_id, average_crowd_level, total_visitors, created_at')
      .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Last 6 hours
      .order('created_at', { ascending: false });

    if (activityError) {
      console.error('Error fetching venue activity:', activityError);
    }

    // Enhance venues with live data
    const enhancedVenues = venues.map((venue: any) => {
      const recentActivity = (activity || []).filter((act: any) => act.venue_id === venue.id);
      
      return {
        ...venue,
        live_data: {
          crowd_trend: calculateCrowdTrend(recentActivity),
          last_updated: venue.updated_at,
          is_trending: recentActivity.length > 0 && 
                      recentActivity[0]?.average_crowd_level > (venue.crowd_level * 0.8)
        }
      };
    });

    console.log(`Live data retrieved: ${enhancedVenues.length} venues, ${events.length} events`);

    return new Response(
      JSON.stringify({ 
        success: true,
        venues: enhancedVenues,
        events,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get live data error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function updateCrowdLevels(supabase: any, updates: { venue_id: number, crowd_level: number }[]) {
  try {
    console.log('Updating crowd levels for', updates.length, 'venues');

    const updatePromises = updates.map(async (update) => {
      const { error } = await supabase
        .from('venues')
        .update({
          crowd_level: update.crowd_level,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.venue_id);

      return { venue_id: update.venue_id, success: !error, error };
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true,
        updated: successful,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Update crowd levels error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

function calculateCrowdTrend(activity: any[]): 'rising' | 'falling' | 'stable' {
  if (activity.length < 2) return 'stable';

  const recent = activity[0]?.average_crowd_level || 0;
  const previous = activity[1]?.average_crowd_level || 0;
  const diff = recent - previous;

  if (diff > 10) return 'rising';
  if (diff < -10) return 'falling';
  return 'stable';
}
