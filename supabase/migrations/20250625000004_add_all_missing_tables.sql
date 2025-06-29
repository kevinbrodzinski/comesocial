-- Comprehensive Migration: Add All Missing Tables
-- This migration adds all the tables that your application needs but are missing from the current schema

-- ========================================
-- SOCIAL POSTS
-- ========================================

CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  post_type TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'photo', 'check_in', 'plan', 'venue_review')),
  privacy_level TEXT NOT NULL DEFAULT 'friends' CHECK (privacy_level IN ('public', 'friends', 'private')),
  
  -- Content-specific fields
  venue_id INTEGER REFERENCES public.venues(id) ON DELETE SET NULL,
  plan_id INTEGER REFERENCES public.plans(id) ON DELETE SET NULL,
  check_in_id UUID REFERENCES public.check_ins(id) ON DELETE SET NULL,
  
  -- Engagement metrics
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Media fields
  photos JSONB,
  tags TEXT[],
  
  -- Metadata
  location TEXT,
  coordinates POINT,
  mood TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- PHOTOS
-- ========================================

CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Content relationships
  post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  check_in_id UUID REFERENCES public.check_ins(id) ON DELETE SET NULL,
  plan_id INTEGER REFERENCES public.plans(id) ON DELETE SET NULL,
  venue_id INTEGER REFERENCES public.venues(id) ON DELETE SET NULL,
  
  -- Photo metadata
  caption TEXT,
  tags TEXT[],
  taken_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Privacy
  privacy_level TEXT NOT NULL DEFAULT 'friends' CHECK (privacy_level IN ('public', 'friends', 'private')),
  
  -- Additional metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- POST INTERACTIONS
-- ========================================

CREATE TABLE IF NOT EXISTS public.post_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share', 'bookmark')),
  content TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, post_id, interaction_type)
);

-- ========================================
-- ACTIVITY FEEDS
-- ========================================

CREATE TABLE IF NOT EXISTS public.activity_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'friend_request', 'plan_invite', 'check_in', 'post_like', 'post_comment',
    'plan_created', 'plan_joined', 'venue_review', 'live_event', 'social_buzz'
  )),
  
  title TEXT NOT NULL,
  content TEXT,
  
  -- Related entities
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  venue_id INTEGER REFERENCES public.venues(id) ON DELETE SET NULL,
  plan_id INTEGER REFERENCES public.plans(id) ON DELETE SET NULL,
  post_id UUID REFERENCES public.social_posts(id) ON DELETE SET NULL,
  
  -- Additional data
  metadata JSONB,
  
  -- Privacy and visibility
  privacy_level TEXT NOT NULL DEFAULT 'friends' CHECK (privacy_level IN ('public', 'friends', 'private')),
  
  -- Expiration for temporary notifications
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- CO-PLANNING DRAFTS
-- ========================================

CREATE TABLE IF NOT EXISTS public.co_planning_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  -- Plan details
  plan_date DATE,
  plan_time TIME,
  
  -- Collaboration settings
  all_can_edit BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'locked', 'converted_to_plan')),
  
  -- Metadata
  converted_plan_id INTEGER REFERENCES public.plans(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- CO-PLANNING PARTICIPANTS
-- ========================================

CREATE TABLE IF NOT EXISTS public.co_planning_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID NOT NULL REFERENCES public.co_planning_drafts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('creator', 'co_planner', 'participant')),
  can_edit BOOLEAN DEFAULT false,
  
  -- Invitation tracking
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Activity tracking
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_online BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(draft_id, user_id)
);

-- ========================================
-- DRAFT STOPS
-- ========================================

CREATE TABLE IF NOT EXISTS public.draft_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID NOT NULL REFERENCES public.co_planning_drafts(id) ON DELETE CASCADE,
  
  -- Stop details
  venue_id INTEGER REFERENCES public.venues(id) ON DELETE SET NULL,
  venue_name TEXT,
  venue_address TEXT,
  venue_coordinates POINT,
  
  -- Stop metadata
  stop_order INTEGER NOT NULL,
  estimated_time INTEGER,
  notes TEXT,
  
  -- Who added this stop
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Status tracking
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'accepted', 'rejected', 'locked')),
  
  -- Voting/consensus
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(draft_id, stop_order)
);

-- ========================================
-- MESSAGE THREADS
-- ========================================

CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_type TEXT NOT NULL DEFAULT 'direct' CHECK (thread_type IN ('direct', 'group', 'plan', 'map-group')),
  
  -- Thread metadata
  title TEXT,
  context TEXT DEFAULT 'direct' CHECK (context IN ('direct', 'plan', 'map')),
  
  -- Thread relationships
  plan_id INTEGER REFERENCES public.plans(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES public.co_planning_drafts(id) ON DELETE CASCADE,
  
  -- Thread settings
  is_pinned BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  
  -- Activity tracking
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- THREAD PARTICIPANTS
-- ========================================

CREATE TABLE IF NOT EXISTS public.thread_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Participation metadata
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_muted BOOLEAN DEFAULT false,
  
  -- Read tracking
  last_read_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  
  -- Role in thread
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(thread_id, user_id)
);

-- ========================================
-- USER PRESENCE
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Status information
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy', 'do_not_disturb')),
  activity TEXT,
  
  -- Location information
  current_location TEXT,
  coordinates POINT,
  location_accuracy INTEGER,
  
  -- Activity tracking
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Device information
  device_type TEXT,
  app_version TEXT,
  
  -- Privacy settings
  location_sharing_enabled BOOLEAN DEFAULT false,
  activity_sharing_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id)
);

-- ========================================
-- USER FAVORITES
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id INTEGER NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  
  -- Favorite metadata
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  visit_count INTEGER DEFAULT 0,
  
  -- Categorization
  category TEXT,
  tags TEXT[],
  
  -- Timestamps
  first_visited_at TIMESTAMP WITH TIME ZONE,
  last_visited_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, venue_id)
);

-- ========================================
-- VENUE ACTIVITY
-- ========================================

CREATE TABLE IF NOT EXISTS public.venue_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id INTEGER NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  
  -- Activity period
  activity_date DATE NOT NULL,
  hour_of_day INTEGER NOT NULL CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  
  -- Crowd and capacity metrics
  average_crowd_level INTEGER CHECK (average_crowd_level >= 0 AND average_crowd_level <= 100),
  peak_crowd_time TIME,
  total_visitors INTEGER,
  check_in_count INTEGER,
  
  -- Quality metrics
  average_rating DECIMAL(3,2) CHECK (average_rating >= 0 AND average_rating <= 5),
  average_wait_time INTEGER,
  
  -- Revenue metrics (if available)
  average_spend_per_person DECIMAL(10,2),
  
  -- Event information
  special_events JSONB,
  live_music BOOLEAN DEFAULT false,
  dj_performance BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(venue_id, activity_date, hour_of_day)
);

-- ========================================
-- SOCIAL INTELLIGENCE
-- ========================================

CREATE TABLE IF NOT EXISTS public.social_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity tracking
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'plan_together', 'check_in_same_venue', 'similar_taste', 'mutual_friend_activity',
    'proximity_alert', 'vibe_match', 'schedule_overlap'
  )),
  
  -- Activity data
  activity_data JSONB,
  relevance_score DECIMAL(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  
  -- Related entities
  venue_id INTEGER REFERENCES public.venues(id) ON DELETE SET NULL,
  plan_id INTEGER REFERENCES public.plans(id) ON DELETE SET NULL,
  
  -- Timestamps
  first_detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- USER ACHIEVEMENTS
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Achievement details
  achievement_type TEXT NOT NULL CHECK (achievement_type IN (
    'first_check_in', 'social_butterfly', 'venue_explorer', 'plan_master',
    'night_owl', 'early_bird', 'trend_setter', 'loyal_customer', 'reviewer'
  )),
  
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  
  -- Progress tracking
  progress_current INTEGER DEFAULT 0,
  progress_target INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT false,
  
  -- Completion data
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- VENUE REVIEWS
-- ========================================

CREATE TABLE IF NOT EXISTS public.venue_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id INTEGER NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  
  -- Review metadata
  visit_date DATE,
  visit_type TEXT CHECK (visit_type IN ('casual', 'date_night', 'group_outing', 'special_occasion')),
  
  -- Rating breakdown
  atmosphere_rating INTEGER CHECK (atmosphere_rating >= 1 AND atmosphere_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- Engagement
  helpful_votes INTEGER DEFAULT 0,
  is_verified_visit BOOLEAN DEFAULT false,
  
  -- Privacy
  is_anonymous BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, venue_id)
);

-- ========================================
-- SOCIAL BUZZ
-- ========================================

CREATE TABLE IF NOT EXISTS public.social_buzz (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Buzz content
  content_type TEXT NOT NULL CHECK (content_type IN ('venue_trending', 'plan_viral', 'user_activity', 'event_hotspot')),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Related entities
  venue_id INTEGER REFERENCES public.venues(id) ON DELETE SET NULL,
  plan_id INTEGER REFERENCES public.plans(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Buzz metrics
  engagement_score DECIMAL(5,2),
  reach_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Trending data
  trend_direction TEXT CHECK (trend_direction IN ('rising', 'falling', 'stable', 'new')),
  trend_percentage DECIMAL(5,2),
  
  -- Geographic scope
  location_scope TEXT DEFAULT 'local' CHECK (location_scope IN ('local', 'city', 'regional', 'national')),
  coordinates POINT,
  
  -- Timestamps
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- INDEXES
-- ========================================

-- Social posts indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_post_type ON public.social_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_venue_id ON public.social_posts(venue_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_plan_id ON public.social_posts(plan_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_privacy_level ON public.social_posts(privacy_level);
CREATE INDEX IF NOT EXISTS idx_social_posts_coordinates ON public.social_posts USING GIST (coordinates);

-- Photos indexes
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_post_id ON public.photos(post_id);
CREATE INDEX IF NOT EXISTS idx_photos_venue_id ON public.photos(venue_id);
CREATE INDEX IF NOT EXISTS idx_photos_plan_id ON public.photos(plan_id);
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_at ON public.photos(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_privacy_level ON public.photos(privacy_level);

-- Post interactions indexes
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_id ON public.post_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_id ON public.post_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_type ON public.post_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_post_interactions_created_at ON public.post_interactions(created_at);

-- Activity feeds indexes
CREATE INDEX IF NOT EXISTS idx_activity_feeds_user_id ON public.activity_feeds(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feeds_activity_type ON public.activity_feeds(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_feeds_created_at ON public.activity_feeds(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feeds_expires_at ON public.activity_feeds(expires_at);
CREATE INDEX IF NOT EXISTS idx_activity_feeds_privacy_level ON public.activity_feeds(privacy_level);

-- Co-planning drafts indexes
CREATE INDEX IF NOT EXISTS idx_co_planning_drafts_creator_id ON public.co_planning_drafts(creator_id);
CREATE INDEX IF NOT EXISTS idx_co_planning_drafts_status ON public.co_planning_drafts(status);
CREATE INDEX IF NOT EXISTS idx_co_planning_drafts_created_at ON public.co_planning_drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_co_planning_drafts_converted_plan_id ON public.co_planning_drafts(converted_plan_id);

-- Co-planning participants indexes
CREATE INDEX IF NOT EXISTS idx_co_planning_participants_draft_id ON public.co_planning_participants(draft_id);
CREATE INDEX IF NOT EXISTS idx_co_planning_participants_user_id ON public.co_planning_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_co_planning_participants_role ON public.co_planning_participants(role);
CREATE INDEX IF NOT EXISTS idx_co_planning_participants_is_online ON public.co_planning_participants(is_online);

-- Draft stops indexes
CREATE INDEX IF NOT EXISTS idx_draft_stops_draft_id ON public.draft_stops(draft_id);
CREATE INDEX IF NOT EXISTS idx_draft_stops_venue_id ON public.draft_stops(venue_id);
CREATE INDEX IF NOT EXISTS idx_draft_stops_stop_order ON public.draft_stops(draft_id, stop_order);
CREATE INDEX IF NOT EXISTS idx_draft_stops_status ON public.draft_stops(status);
CREATE INDEX IF NOT EXISTS idx_draft_stops_added_by ON public.draft_stops(added_by);
CREATE INDEX IF NOT EXISTS idx_draft_stops_coordinates ON public.draft_stops USING GIST (venue_coordinates);

-- Message threads indexes
CREATE INDEX IF NOT EXISTS idx_message_threads_thread_type ON public.message_threads(thread_type);
CREATE INDEX IF NOT EXISTS idx_message_threads_context ON public.message_threads(context);
CREATE INDEX IF NOT EXISTS idx_message_threads_plan_id ON public.message_threads(plan_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_draft_id ON public.message_threads(draft_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_created_by ON public.message_threads(created_by);
CREATE INDEX IF NOT EXISTS idx_message_threads_last_message_at ON public.message_threads(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_threads_is_pinned ON public.message_threads(is_pinned);

-- Thread participants indexes
CREATE INDEX IF NOT EXISTS idx_thread_participants_thread_id ON public.thread_participants(thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_participants_user_id ON public.thread_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_thread_participants_role ON public.thread_participants(role);
CREATE INDEX IF NOT EXISTS idx_thread_participants_last_read_at ON public.thread_participants(last_read_at);
CREATE INDEX IF NOT EXISTS idx_thread_participants_unread_count ON public.thread_participants(unread_count);

-- User presence indexes
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON public.user_presence(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_user_presence_coordinates ON public.user_presence USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS idx_user_presence_location_sharing ON public.user_presence(location_sharing_enabled);

-- User favorites indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_venue_id ON public.user_favorites(venue_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_category ON public.user_favorites(category);
CREATE INDEX IF NOT EXISTS idx_user_favorites_rating ON public.user_favorites(rating);
CREATE INDEX IF NOT EXISTS idx_user_favorites_last_visited ON public.user_favorites(last_visited_at DESC);

-- Venue activity indexes
CREATE INDEX IF NOT EXISTS idx_venue_activity_venue_id ON public.venue_activity(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_activity_date ON public.venue_activity(activity_date);
CREATE INDEX IF NOT EXISTS idx_venue_activity_hour ON public.venue_activity(hour_of_day);
CREATE INDEX IF NOT EXISTS idx_venue_activity_crowd_level ON public.venue_activity(average_crowd_level);
CREATE INDEX IF NOT EXISTS idx_venue_activity_rating ON public.venue_activity(average_rating);
CREATE INDEX IF NOT EXISTS idx_venue_activity_composite ON public.venue_activity(venue_id, activity_date, hour_of_day);

-- Social intelligence indexes
CREATE INDEX IF NOT EXISTS idx_social_intelligence_user_id ON public.social_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_social_intelligence_friend_id ON public.social_intelligence(friend_id);
CREATE INDEX IF NOT EXISTS idx_social_intelligence_activity_type ON public.social_intelligence(activity_type);
CREATE INDEX IF NOT EXISTS idx_social_intelligence_relevance_score ON public.social_intelligence(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_social_intelligence_venue_id ON public.social_intelligence(venue_id);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON public.user_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON public.user_achievements(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed_at ON public.user_achievements(completed_at DESC);

-- Venue reviews indexes
CREATE INDEX IF NOT EXISTS idx_venue_reviews_user_id ON public.venue_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_reviews_venue_id ON public.venue_reviews(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_reviews_rating ON public.venue_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_venue_reviews_visit_date ON public.venue_reviews(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_venue_reviews_helpful_votes ON public.venue_reviews(helpful_votes DESC);

-- Social buzz indexes
CREATE INDEX IF NOT EXISTS idx_social_buzz_content_type ON public.social_buzz(content_type);
CREATE INDEX IF NOT EXISTS idx_social_buzz_engagement_score ON public.social_buzz(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_social_buzz_trend_direction ON public.social_buzz(trend_direction);
CREATE INDEX IF NOT EXISTS idx_social_buzz_detected_at ON public.social_buzz(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_buzz_expires_at ON public.social_buzz(expires_at);
CREATE INDEX IF NOT EXISTS idx_social_buzz_coordinates ON public.social_buzz USING GIST (coordinates);

-- ========================================
-- TRIGGERS
-- ========================================

-- Update timestamps for all new tables
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON public.social_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON public.photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_interactions_updated_at BEFORE UPDATE ON public.post_interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activity_feeds_updated_at BEFORE UPDATE ON public.activity_feeds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_co_planning_drafts_updated_at BEFORE UPDATE ON public.co_planning_drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_co_planning_participants_updated_at BEFORE UPDATE ON public.co_planning_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_draft_stops_updated_at BEFORE UPDATE ON public.draft_stops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_threads_updated_at BEFORE UPDATE ON public.message_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_thread_participants_updated_at BEFORE UPDATE ON public.thread_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_presence_updated_at BEFORE UPDATE ON public.user_presence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_favorites_updated_at BEFORE UPDATE ON public.user_favorites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venue_activity_updated_at BEFORE UPDATE ON public.venue_activity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_intelligence_updated_at BEFORE UPDATE ON public.social_intelligence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON public.user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venue_reviews_updated_at BEFORE UPDATE ON public.venue_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_buzz_updated_at BEFORE UPDATE ON public.social_buzz FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 