-- Production Seed Data for Nightli Nova Vibes
-- This file contains minimal production data for initial deployment

-- ========================================
-- VENUES (Production - Major Cities)
-- ========================================

INSERT INTO public.venues (id, name, address, city, state, zip_code, coordinates, venue_type, vibe, price_level, rating, review_count, features, age_requirement, dress_code, website_url, phone, hours, image, distance, description, average_wait, best_times, last_visited, map_x, map_y) VALUES
-- New York venues
('550e8400-e29b-41d4-a716-446655440101', 'Skyline Lounge NYC', '123 5th Ave', 'New York', 'NY', '10003', point(40.7505, -73.9934), 'lounge', 'upscale', 4, 4.6, 342, ARRAY['City Views', 'Craft Cocktails', 'VIP Service', 'Reservations'], 21, 'Smart Casual', 'https://skyline-nyc.com', '+1-212-555-0101', '{"monday": "6pm-2am", "tuesday": "6pm-2am", "wednesday": "6pm-2am", "thursday": "6pm-2am", "friday": "5pm-2am", "saturday": "5pm-2am", "sunday": "6pm-12am"}', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', '0.3 mi', 'Exclusive rooftop lounge with Manhattan skyline views', '30-45 min', ARRAY['8:00 PM', '9:30 PM'], '2024-01-20 21:00:00+00', 120, 150),
('550e8400-e29b-41d4-a716-446655440102', 'Pulse NYC', '456 W 14th St', 'New York', 'NY', '10014', point(40.7389, -74.0060), 'club', 'electric', 4, 4.4, 567, ARRAY['DJ Sets', 'Dance Floor', 'Bottle Service', 'VIP Area'], 21, 'Club Attire', 'https://pulse-nyc.com', '+1-212-555-0102', '{"friday": "10pm-4am", "saturday": "10pm-4am"}', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', '0.8 mi', 'High-energy nightclub in the heart of Manhattan', '45-60 min', ARRAY['11:00 PM', '12:30 AM'], '2024-01-25 01:30:00+00', 180, 200),

-- Los Angeles venues
('550e8400-e29b-41d4-a716-446655440201', 'Rooftop LA', '789 Sunset Blvd', 'Los Angeles', 'CA', '90069', point(34.0928, -118.3287), 'rooftop', 'intimate', 4, 4.7, 289, ARRAY['City Views', 'Craft Cocktails', 'Small Plates', 'Reservations'], 21, 'Smart Casual', 'https://rooftop-la.com', '+1-323-555-0101', '{"monday": "5pm-12am", "tuesday": "5pm-12am", "wednesday": "5pm-12am", "thursday": "5pm-12am", "friday": "5pm-1am", "saturday": "5pm-1am", "sunday": "5pm-11pm"}', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', '0.5 mi', 'Stunning rooftop bar with Hollywood views', '25-40 min', ARRAY['7:00 PM', '8:30 PM'], '2024-01-22 20:15:00+00', 150, 120),
('550e8400-e29b-41d4-a716-446655440202', 'The Basement LA', '321 Melrose Ave', 'Los Angeles', 'CA', '90036', point(34.0837, -118.3287), 'bar', 'casual', 2, 4.1, 156, ARRAY['Live Music', 'Craft Beer', 'Food Trucks', 'Outdoor Seating'], 21, 'Casual', 'https://basement-la.com', '+1-323-555-0102', '{"monday": "4pm-12am", "tuesday": "4pm-12am", "wednesday": "4pm-12am", "thursday": "4pm-12am", "friday": "4pm-2am", "saturday": "4pm-2am", "sunday": "4pm-11pm"}', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', '1.2 mi', 'Trendy basement bar with local bands', '10-20 min', ARRAY['8:00 PM', '9:30 PM'], '2024-01-28 21:45:00+00', 200, 180),

-- Miami venues
('550e8400-e29b-41d4-a716-446655440301', 'Ocean Club Miami', '654 Ocean Dr', 'Miami Beach', 'FL', '33139', point(25.7617, -80.1918), 'lounge', 'upscale', 4, 4.5, 234, ARRAY['Ocean Views', 'Craft Cocktails', 'VIP Service', 'Valet Parking'], 21, 'Upscale', 'https://ocean-club-miami.com', '+1-305-555-0101', '{"monday": "6pm-2am", "tuesday": "6pm-2am", "wednesday": "6pm-2am", "thursday": "6pm-2am", "friday": "6pm-2am", "saturday": "6pm-2am", "sunday": "6pm-12am"}', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', '0.2 mi', 'Luxury oceanfront lounge with beach vibes', '20-35 min', ARRAY['8:00 PM', '9:30 PM'], '2024-01-30 22:00:00+00', 100, 80);

-- ========================================
-- PLANS (Production - Sample Plans)
-- ========================================

INSERT INTO public.plans (id, name, description, plan_type, date, time, status, host_id, co_planners, all_can_edit, estimated_cost_min, estimated_cost_max, duration_hours, notes, share_link, overview_message, organizer, estimated_cost, duration, completed_date, attendance_status, user_rating, actual_cost, connections, memories, photos, reviews) VALUES
-- Sample production plans
('660e8400-e29b-41d4-a716-446655440101', 'NYC Night Out', 'Epic night in Manhattan! Starting at Skyline Lounge for cocktails with city views, then hitting Pulse for dancing.', 'night_out', '2024-03-15', '20:00:00', 'planned', 'auth.users.1', ARRAY['auth.users.2'], true, 120, 180, 5, 'Dress to impress!', 'https://nightli.app/plan/nyc123', 'Ready for an epic NYC night! 🗽', 'Demo User', '$120-180', '5-6 hours', NULL, NULL, NULL, NULL, ARRAY['Demo Friend'], NULL, NULL, NULL),
('660e8400-e29b-41d4-a716-446655440201', 'LA Rooftop Evening', 'Chill rooftop drinks with amazing Hollywood views.', 'drinks', '2024-03-16', '19:00:00', 'planned', 'auth.users.2', ARRAY['auth.users.1'], false, 60, 90, 3, 'Perfect for sunset!', 'https://nightli.app/plan/la456', 'Chill vibes in LA ✨', 'Demo User 2', '$60-90', '3-4 hours', NULL, NULL, NULL, NULL, ARRAY['Demo Friend'], NULL, NULL, NULL);

-- ========================================
-- PLAN STOPS (Production)
-- ========================================

INSERT INTO public.plan_stops (id, plan_id, venue_id, venue_name, venue_address, venue_coordinates, stop_order, estimated_time_minutes, estimated_cost, notes, status, check_in_time, stop_type, start_time, end_time, max_capacity, dress_code, booking_status) VALUES
-- NYC Night Out stops
('770e8400-e29b-41d4-a716-446655440101', '660e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', 'Skyline Lounge NYC', '123 5th Ave', point(40.7505, -73.9934), 1, 120, 80, 'Start with city views and cocktails', 'planned', NULL, 'lounge', '8:00 PM', '10:00 PM', 50, 'Smart Casual', 'confirmed'),
('770e8400-e29b-41d4-a716-446655440102', '660e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440102', 'Pulse NYC', '456 W 14th St', point(40.7389, -74.0060), 2, 180, 100, 'Dance the night away!', 'planned', NULL, 'club', '10:30 PM', '1:30 AM', 200, 'Club Attire', 'confirmed'),

-- LA Rooftop Evening stops
('770e8400-e29b-41d4-a716-446655440201', '660e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440201', 'Rooftop LA', '789 Sunset Blvd', point(34.0928, -118.3287), 1, 180, 90, 'Perfect for sunset drinks', 'planned', NULL, 'rooftop', '7:00 PM', '10:00 PM', 30, 'Smart Casual', 'confirmed');

-- ========================================
-- PLAN PARTICIPANTS (Production)
-- ========================================

INSERT INTO public.plan_participants (id, plan_id, user_id, status) VALUES
-- NYC Night Out participants
('880e8400-e29b-41d4-a716-446655440101', '660e8400-e29b-41d4-a716-446655440101', 'auth.users.1', 'going'),
('880e8400-e29b-41d4-a716-446655440102', '660e8400-e29b-41d4-a716-446655440101', 'auth.users.2', 'going'),

-- LA Rooftop Evening participants
('880e8400-e29b-41d4-a716-446655440201', '660e8400-e29b-41d4-a716-446655440201', 'auth.users.1', 'going'),
('880e8400-e29b-41d4-a716-446655440202', '660e8400-e29b-41d4-a716-446655440201', 'auth.users.2', 'going');

-- ========================================
-- FRIENDSHIPS (Production - Demo Users)
-- ========================================

INSERT INTO public.friendships (id, user_id, friend_id, status) VALUES
-- Demo user friendships
('990e8400-e29b-41d4-a716-446655440101', 'auth.users.1', 'auth.users.2', 'accepted'),
('990e8400-e29b-41d4-a716-446655440102', 'auth.users.2', 'auth.users.1', 'accepted');

-- ========================================
-- FRIEND ACTIVITY (Production)
-- ========================================

INSERT INTO public.friend_activity (id, user_id, current_action, location, last_seen, activity, current_plan_id, current_plan_name, is_on_plan, coordinates, distance_from_user, time_ago, frequent_plan_mate, is_nearby) VALUES
-- Demo user activity
('bb0e8400-e29b-41d4-a716-446655440101', 'auth.users.1', 'offline', 'Home', '2024-03-14 18:00:00+00', 'Planning tonight''s adventure', NULL, NULL, false, point(40.7505, -73.9934), 0.0, '2h ago', false, false),
('bb0e8400-e29b-41d4-a716-446655440102', 'auth.users.2', 'offline', 'Home', '2024-03-14 17:30:00+00', 'Getting ready for the night', NULL, NULL, false, point(34.0928, -118.3287), 0.0, '3h ago', false, false);

-- ========================================
-- MESSAGES (Production)
-- ========================================

INSERT INTO public.messages (id, sender_id, recipient_id, content, message_type, venue_id, plan_id, status, plan_action) VALUES
-- Demo messages
('cc0e8400-e29b-41d4-a716-446655440101', 'auth.users.1', 'auth.users.2', 'Hey! Ready for tonight?', 'message', NULL, NULL, 'read', NULL),
('cc0e8400-e29b-41d4-a716-446655440102', 'auth.users.2', 'auth.users.1', 'Absolutely! Can''t wait!', 'message', NULL, NULL, 'read', NULL);

-- ========================================
-- NOTIFICATIONS (Production)
-- ========================================

INSERT INTO public.notifications (id, user_id, type, title, message, data, read_at, friend_id, plan_id, venue_id, venue, auto_expire) VALUES
-- Demo notifications
('dd0e8400-e29b-41d4-a716-446655440101', 'auth.users.1', 'plan_invite', 'Plan Invite', 'Demo User invited you to NYC Night Out', '{"plan_id": "660e8400-e29b-41d4-a716-446655440101"}', NULL, 'Demo User', 1, NULL, NULL, NULL),
('dd0e8400-e29b-41d4-a716-446655440102', 'auth.users.2', 'plan_invite', 'Plan Invite', 'Demo User 2 invited you to LA Rooftop Evening', '{"plan_id": "660e8400-e29b-41d4-a716-446655440201"}', NULL, 'Demo User 2', 2, NULL, NULL, NULL);

-- ========================================
-- CHECK-INS (Production)
-- ========================================

INSERT INTO public.check_ins (id, user_id, venue_id, plan_id, check_in_time, check_out_time, crowd_level, vibe_rating, notes, photos, tags, is_public) VALUES
-- Demo check-ins
('ee0e8400-e29b-41d4-a716-446655440101', 'auth.users.1', '550e8400-e29b-41d4-a716-446655440101', '660e8400-e29b-41d4-a716-446655440101', '2024-03-14 20:00:00+00', NULL, 70, 4, 'Amazing city views!', ARRAY['https://example.com/demo-checkin1.jpg'], ARRAY['city-views', 'craft-cocktails'], true),
('ee0e8400-e29b-41d4-a716-446655440102', 'auth.users.2', '550e8400-e29b-41d4-a716-446655440201', '660e8400-e29b-41d4-a716-446655440201', '2024-03-14 19:00:00+00', '2024-03-14 21:00:00+00', 60, 5, 'Perfect sunset!', ARRAY['https://example.com/demo-checkin2.jpg'], ARRAY['sunset-views', 'hollywood'], true);

-- ========================================
-- USER VIBES (Production)
-- ========================================

INSERT INTO public.user_vibes (id, user_id, vibe_type, message, is_public, expires_at, set_at, custom_text) VALUES
-- Demo vibes
('ff0e8400-e29b-41d4-a716-446655440101', 'auth.users.1', 'hype-night', 'Ready for an epic NYC night! 🗽', true, '2024-03-15 06:00:00+00', '2024-03-14 18:00:00+00', 'Ready for an epic NYC night! 🗽'),
('ff0e8400-e29b-41d4-a716-446655440102', 'auth.users.2', 'chill-mode', 'Chill vibes in LA ✨', true, '2024-03-15 06:00:00+00', '2024-03-14 17:30:00+00', 'Chill vibes in LA ✨');

-- ========================================
-- WATCHLIST (Production)
-- ========================================

INSERT INTO public.watchlist (id, user_id, venue_id) VALUES
-- Demo watchlist
('gg0e8400-e29b-41d4-a716-446655440101', 'auth.users.1', '550e8400-e29b-41d4-a716-446655440101'),
('gg0e8400-e29b-41d4-a716-446655440102', 'auth.users.2', '550e8400-e29b-41d4-a716-446655440201'); 