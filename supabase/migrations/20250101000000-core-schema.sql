-- Core Database Schema for Nightli Nova Vibes
-- This migration creates all the essential tables for the social nightlife planning app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================
-- CORE TABLES
-- ========================================

-- Venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  coordinates POINT, -- (latitude, longitude)
  venue_type TEXT, -- 'bar', 'club', 'restaurant', 'lounge', 'rooftop', etc.
  vibe TEXT, -- 'upscale', 'casual', 'intimate', 'electric', etc.
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4), -- 1-4 scale
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  features TEXT[], -- ['WiFi', 'Parking', 'Live Music', 'Photos OK']
  age_requirement INTEGER DEFAULT 21,
  dress_code TEXT,
  website_url TEXT,
  phone TEXT,
  hours JSONB, -- Store operating hours
  -- Frontend alignment fields
  image TEXT, -- Venue image URL
  distance TEXT, -- e.g., "0.8 mi"
  description TEXT,
  average_wait TEXT, -- e.g., "15-30 min"
  best_times TEXT[], -- Array of best times
  last_visited TIMESTAMP WITH TIME ZONE,
  -- Map positioning (frontend x, y coordinates)
  map_x INTEGER,
  map_y INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT NOT NULL, -- 'night_out', 'dinner', 'drinks', 'weekend_getaway', etc.
  date DATE NOT NULL,
  time TIME,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'active', 'completed', 'cancelled')),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  co_planners UUID[] DEFAULT '{}', -- Array of user IDs who can edit
  all_can_edit BOOLEAN DEFAULT false,
  estimated_cost_min INTEGER,
  estimated_cost_max INTEGER,
  duration_hours INTEGER,
  notes TEXT,
  share_link TEXT,
  overview_message TEXT,
  -- Frontend alignment fields
  organizer TEXT, -- Organizer name
  estimated_cost TEXT, -- e.g., "$80-120"
  duration TEXT, -- e.g., "5-6 hours"
  -- Plan completion fields
  completed_date DATE,
  attendance_status TEXT CHECK (attendance_status IN ('attended', 'missed', 'partial')),
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  actual_cost TEXT, -- e.g., "$125"
  -- Social fields
  connections TEXT[], -- Array of friend names
  memories TEXT[], -- Array of memory descriptions
  -- Media fields
  photos JSONB, -- Array of photo objects
  reviews JSONB, -- Array of review objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Plan stops (venues within a plan)
CREATE TABLE public.plan_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  venue_name TEXT, -- Fallback if venue_id is null
  venue_address TEXT,
  venue_coordinates POINT,
  stop_order INTEGER NOT NULL,
  estimated_time_minutes INTEGER,
  estimated_cost INTEGER,
  notes TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'current', 'completed', 'skipped')),
  check_in_time TIMESTAMP WITH TIME ZONE,
  -- Frontend alignment fields
  stop_type TEXT, -- e.g., 'bar', 'club', 'restaurant'
  start_time TEXT, -- e.g., "9:00 PM"
  end_time TEXT, -- e.g., "11:00 PM"
  max_capacity INTEGER,
  dress_code TEXT,
  booking_status TEXT CHECK (booking_status IN ('confirmed', 'pending', 'none')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(plan_id, stop_order)
);

-- Plan participants (RSVPs)
CREATE TABLE public.plan_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('going', 'maybe', 'cant_go', 'pending')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(plan_id, user_id)
);

-- Friends relationships
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Friend requests
CREATE TABLE public.friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

-- Friend activity tracking (for real-time status)
CREATE TABLE public.friend_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Current status fields
  current_action TEXT CHECK (current_action IN ('checked-in', 'on-the-way', 'pre-gaming', 'just-left', 'offline')),
  location TEXT, -- Current location description
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  activity TEXT, -- Activity description
  -- Plan-related fields
  current_plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  current_plan_name TEXT,
  is_on_plan BOOLEAN DEFAULT false,
  -- Location fields
  coordinates POINT, -- Current coordinates
  distance_from_user DECIMAL(5,2), -- Distance in miles
  time_ago TEXT, -- e.g., "10m ago", "now"
  -- Social fields
  frequent_plan_mate BOOLEAN DEFAULT false,
  is_nearby BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages/chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'message' CHECK (message_type IN ('message', 'ping', 'plan')),
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  -- Plan-specific fields
  plan_action TEXT CHECK (plan_action IN ('created', 'joined', 'updated', 'comment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('friend_request', 'plan_invite', 'check_in', 'plan_update', 'message', 'ping')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data like venue_id, plan_id, etc.
  read_at TIMESTAMP WITH TIME ZONE,
  -- Frontend alignment fields
  friend_id TEXT, -- Friend identifier
  plan_id INTEGER, -- Plan identifier
  venue_id INTEGER, -- Venue identifier
  venue JSONB, -- Venue object with name, address, coordinates
  auto_expire INTEGER, -- seconds - only for non-persistent notifications
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Check-ins (user activity at venues)
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  crowd_level INTEGER CHECK (crowd_level >= 0 AND crowd_level <= 100),
  vibe_rating INTEGER CHECK (vibe_rating >= 1 AND vibe_rating <= 5),
  notes TEXT,
  photos TEXT[], -- Array of photo URLs
  tags TEXT[], -- Array of tags like ['great-music', 'amazing-views']
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User vibes/mood
CREATE TABLE public.user_vibes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vibe_type TEXT NOT NULL, -- 'hype-night', 'chill-mode', 'going-out', etc.
  message TEXT,
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  -- Frontend alignment fields
  set_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  custom_text TEXT, -- Custom message from user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Watchlist (venues users are watching)
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Venues indexes
CREATE INDEX idx_venues_coordinates ON public.venues USING GIST (coordinates);
CREATE INDEX idx_venues_type ON public.venues(venue_type);
CREATE INDEX idx_venues_city ON public.venues(city);
CREATE INDEX idx_venues_name_trgm ON public.venues USING GIN (name gin_trgm_ops);

-- Plans indexes
CREATE INDEX idx_plans_host_id ON public.plans(host_id);
CREATE INDEX idx_plans_date ON public.plans(date);
CREATE INDEX idx_plans_status ON public.plans(status);
CREATE INDEX idx_plans_co_planners ON public.plans USING GIN (co_planners);

-- Plan participants indexes
CREATE INDEX idx_plan_participants_plan_id ON public.plan_participants(plan_id);
CREATE INDEX idx_plan_participants_user_id ON public.plan_participants(user_id);
CREATE INDEX idx_plan_participants_status ON public.plan_participants(status);

-- Friendships indexes
CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

-- Friend activity indexes
CREATE INDEX idx_friend_activity_user_id ON public.friend_activity(user_id);
CREATE INDEX idx_friend_activity_coordinates ON public.friend_activity USING GIST (coordinates);
CREATE INDEX idx_friend_activity_current_action ON public.friend_activity(current_action);

-- Messages indexes
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Check-ins indexes
CREATE INDEX idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX idx_check_ins_venue_id ON public.check_ins(venue_id);
CREATE INDEX idx_check_ins_check_in_time ON public.check_ins(check_in_time);

-- User vibes indexes
CREATE INDEX idx_user_vibes_user_id ON public.user_vibes(user_id);
CREATE INDEX idx_user_vibes_expires_at ON public.user_vibes(expires_at);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vibes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLICIES
-- ========================================

-- Venues policies (public read, authenticated users can create)
CREATE POLICY "Venues are viewable by everyone" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create venues" ON public.venues FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update venues they created" ON public.venues FOR UPDATE USING (auth.uid() = created_by);

-- Plans policies
CREATE POLICY "Users can view plans they're part of" ON public.plans FOR SELECT USING (
  auth.uid() = host_id OR 
  auth.uid() = ANY(co_planners) OR
  EXISTS (SELECT 1 FROM public.plan_participants WHERE plan_id = plans.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create plans" ON public.plans FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts and co-planners can update plans" ON public.plans FOR UPDATE USING (
  auth.uid() = host_id OR auth.uid() = ANY(co_planners)
);

-- Plan participants policies
CREATE POLICY "Users can view participants of plans they're in" ON public.plan_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.plans WHERE id = plan_id AND (
    host_id = auth.uid() OR 
    auth.uid() = ANY(co_planners) OR
    EXISTS (SELECT 1 FROM public.plan_participants WHERE plan_id = plans.id AND user_id = auth.uid())
  ))
);
CREATE POLICY "Users can manage their own RSVPs" ON public.plan_participants FOR ALL USING (user_id = auth.uid());

-- Friendships policies
CREATE POLICY "Users can view their friendships" ON public.friendships FOR SELECT USING (
  user_id = auth.uid() OR friend_id = auth.uid()
);
CREATE POLICY "Users can manage their friendships" ON public.friendships FOR ALL USING (user_id = auth.uid());

-- Friend activity policies
CREATE POLICY "Users can view their own activity" ON public.friend_activity FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can view friends' public activity" ON public.friend_activity FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.friendships WHERE 
    (user_id = auth.uid() AND friend_id = friend_activity.user_id) OR
    (friend_id = auth.uid() AND user_id = friend_activity.user_id)
  ) AND status = 'accepted'
);
CREATE POLICY "Users can update their own activity" ON public.friend_activity FOR ALL USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their sent messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Check-ins policies
CREATE POLICY "Users can view public check-ins" ON public.check_ins FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own check-ins" ON public.check_ins FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own check-ins" ON public.check_ins FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own check-ins" ON public.check_ins FOR UPDATE USING (user_id = auth.uid());

-- User vibes policies
CREATE POLICY "Users can view their own vibes" ON public.user_vibes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can view friends' public vibes" ON public.user_vibes FOR SELECT USING (
  is_public = true AND EXISTS (SELECT 1 FROM public.friendships WHERE 
    (user_id = auth.uid() AND friend_id = user_vibes.user_id) OR
    (friend_id = auth.uid() AND user_id = user_vibes.user_id)
  ) AND status = 'accepted'
);
CREATE POLICY "Users can manage their own vibes" ON public.user_vibes FOR ALL USING (user_id = auth.uid());

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plan_stops_updated_at BEFORE UPDATE ON public.plan_stops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plan_participants_updated_at BEFORE UPDATE ON public.plan_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friend_requests_updated_at BEFORE UPDATE ON public.friend_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friend_activity_updated_at BEFORE UPDATE ON public.friend_activity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle friend request acceptance
CREATE OR REPLACE FUNCTION handle_friend_request_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Create friendship records for both users
    INSERT INTO public.friendships (user_id, friend_id, status)
    VALUES (NEW.from_user_id, NEW.to_user_id, 'accepted')
    ON CONFLICT (user_id, friend_id) DO NOTHING;
    
    INSERT INTO public.friendships (user_id, friend_id, status)
    VALUES (NEW.to_user_id, NEW.from_user_id, 'accepted')
    ON CONFLICT (user_id, friend_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER friend_request_accepted_trigger
  AFTER UPDATE ON public.friend_requests
  FOR EACH ROW EXECUTE FUNCTION handle_friend_request_acceptance(); 