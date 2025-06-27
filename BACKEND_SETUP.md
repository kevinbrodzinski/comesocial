# Backend Setup Guide - Nightli Nova Vibes

This guide covers setting up the Supabase backend for Nightli Nova Vibes, including the complete database schema with all frontend-aligned fields.

## 🚀 Quick Start

### Prerequisites

1. **Supabase CLI** - Install globally:
   ```bash
   npm install -g supabase
   ```

2. **Node.js** - Version 18 or higher

3. **Git** - For version control

### Development Setup

1. **Clone and navigate to the project:**
   ```bash
   cd nightli-nova-vibes
   ```

2. **Run the automated setup:**
   ```bash
   npm run setup:backend
   ```
   
   This will:
   - Start Supabase locally
   - Apply all migrations
   - Seed with development data
   - Provide connection details

3. **Access your local Supabase:**
   - Dashboard: http://localhost:54323
   - API: http://localhost:54321
   - Database: `postgresql://postgres:postgres@localhost:54322/postgres`

### Production Setup

1. **Set environment variables:**
   ```bash
   export SUPABASE_URL="your_supabase_project_url"
   export SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

2. **Deploy to production:**
   ```bash
   npm run setup:backend:prod
   ```

## 📊 Database Schema

The backend includes **12 core tables** with complete frontend alignment:

### Core Tables

1. **`venues`** - Venue information with map positioning
2. **`plans`** - Social nightlife plans with completion tracking
3. **`plan_stops`** - Individual stops within plans
4. **`plan_participants`** - RSVPs and participant management
5. **`friendships`** - Friend relationships
6. **`friend_requests`** - Friend request management
7. **`friend_activity`** - Real-time friend status tracking
8. **`messages`** - Chat and messaging system
9. **`notifications`** - Push notifications and alerts
10. **`check_ins`** - Venue check-ins with social features
11. **`user_vibes`** - User mood and status updates
12. **`watchlist`** - Saved venues

### Enhanced Features

#### Frontend Alignment Fields
- **Venues**: Map positioning (`map_x`, `map_y`), distance, wait times, best times
- **Plans**: Completion tracking, photos, reviews, memories, connections
- **Notifications**: Auto-expire timers, venue objects, friend identifiers
- **User Vibes**: Custom text, set timestamps, expiration

#### Real-time Features
- **Friend Activity**: Live status updates, location tracking, plan participation
- **Check-ins**: Crowd levels, vibe ratings, photo sharing
- **Messages**: Plan-specific actions, venue pings

#### Social Features
- **Friendships**: Bidirectional relationships with status tracking
- **Plan Collaboration**: Co-planners, edit permissions, participant management
- **Social Sharing**: Photos, reviews, memories, connections

## 🔧 Available Commands

### Package.json Scripts

```bash
# Development
npm run setup:backend          # Full dev setup
npm run setup:backend:reset    # Reset dev database
npm run setup:backend:status   # Check Supabase status

# Production
npm run setup:backend:prod     # Deploy to production

# Database
npm run db:reset              # Reset database
npm run db:seed               # Seed with dev data
npm run db:seed:prod          # Seed with production data
```

### Direct Supabase Commands

```bash
# Local development
supabase start                 # Start local Supabase
supabase stop                  # Stop local Supabase
supabase status               # Check status

# Database management
supabase db reset             # Reset local database
supabase db push              # Push migrations to remote
supabase db seed              # Apply seed data

# Project management
supabase link --project-ref <ref>  # Link to remote project
supabase unlink               # Unlink from remote project
```

## 📁 File Structure

```
supabase/
├── config.toml                    # Supabase configuration
├── migrations/
│   └── 20250101000000-core-schema.sql  # Complete database schema
├── seed.sql                       # Development seed data
├── seed-production.sql            # Production seed data
└── functions/
    └── google-places-search/
        └── index.ts               # Google Places search function
```

## 🗄️ Database Schema Details

### Venues Table
```sql
CREATE TABLE public.venues (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  coordinates POINT,
  venue_type TEXT,
  vibe TEXT,
  price_level INTEGER,
  rating DECIMAL(3,2),
  -- Frontend alignment fields
  image TEXT,
  distance TEXT,
  description TEXT,
  average_wait TEXT,
  best_times TEXT[],
  map_x INTEGER,
  map_y INTEGER,
  -- ... additional fields
);
```

### Plans Table
```sql
CREATE TABLE public.plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  host_id UUID NOT NULL,
  co_planners UUID[],
  -- Frontend alignment fields
  organizer TEXT,
  estimated_cost TEXT,
  duration TEXT,
  completed_date DATE,
  attendance_status TEXT,
  user_rating INTEGER,
  actual_cost TEXT,
  connections TEXT[],
  memories TEXT[],
  photos JSONB,
  reviews JSONB,
  -- ... additional fields
);
```

### Friend Activity Table
```sql
CREATE TABLE public.friend_activity (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  current_action TEXT,
  location TEXT,
  coordinates POINT,
  distance_from_user DECIMAL(5,2),
  time_ago TEXT,
  current_plan_id UUID,
  is_on_plan BOOLEAN,
  frequent_plan_mate BOOLEAN,
  is_nearby BOOLEAN,
  -- ... additional fields
);
```

## 🔐 Security & Permissions

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

- **Venues**: Public read, authenticated create
- **Plans**: Host/co-planners/participants can view/edit
- **Friendships**: Users can manage their own relationships
- **Messages**: Sender/recipient access only
- **Check-ins**: Public read, owner write
- **User Vibes**: Friends can view public vibes

### Authentication
- Supabase Auth integration
- User profiles auto-created on signup
- Email/password and social auth support

## 🌱 Seed Data

### Development Data
- **5 venues** across different types (lounge, club, rooftop, bar)
- **5 plans** with various statuses (planned, completed)
- **5 users** with realistic activity and relationships
- **Complete social network** with friendships, messages, notifications
- **Real-time activity** with check-ins, vibes, and status updates

### Production Data
- **3 venues** in major cities (NYC, LA, Miami)
- **2 sample plans** for demonstration
- **Minimal user data** for initial deployment
- **Clean, professional** data suitable for production

## 🔄 Migration Strategy

### Development Workflow
1. Make schema changes in `migrations/`
2. Test locally with `supabase db reset`
3. Verify with development seed data
4. Commit and push changes

### Production Deployment
1. Link to production project: `supabase link --project-ref <ref>`
2. Push migrations: `supabase db push`
3. Apply production seed: `supabase db seed --file supabase/seed-production.sql`
4. Verify deployment in Supabase dashboard

## 🐛 Troubleshooting

### Common Issues

**Supabase CLI not found:**
```bash
npm install -g supabase
```

**Port conflicts:**
```bash
supabase stop
supabase start
```

**Migration errors:**
```bash
supabase db reset
```

**Seed data issues:**
```bash
supabase db seed --file supabase/seed.sql
```

### Reset Everything
```bash
npm run setup:backend:reset
```

## 📈 Performance Considerations

### Indexes
- **Geospatial**: Venue coordinates, friend activity locations
- **Text search**: Venue names with trigram indexes
- **Relationships**: Foreign keys with appropriate indexes
- **Time-based**: Created/updated timestamps

### Optimization
- **Connection pooling**: Configured in Supabase
- **Query optimization**: Efficient joins and filters
- **Real-time subscriptions**: Optimized for live updates

## 🔗 Integration Points

### Frontend Integration
- **Supabase Client**: Configured in `src/integrations/supabase/client.ts`
- **TypeScript Types**: Generated from schema
- **Real-time Subscriptions**: For live updates
- **Row Level Security**: Automatic permission enforcement

### External Services
- **Google Places API**: Venue search and details
- **Google Maps**: Location services and directions
- **Push Notifications**: Via Supabase Edge Functions

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎯 Next Steps

1. **Test the setup** with the development data
2. **Configure environment variables** in your frontend
3. **Deploy to production** when ready
4. **Monitor performance** and adjust as needed
5. **Add custom functions** for specific business logic

---

**Need help?** Check the troubleshooting section or create an issue in the repository. 