export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_feeds: {
        Row: {
          activity_type: string
          content: string | null
          created_at: string
          id: string
          metadata: Json | null
          plan_id: number | null
          privacy_level: string
          related_user_id: string | null
          title: string
          updated_at: string
          user_id: string
          venue_id: number | null
        }
        Insert: {
          activity_type: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          plan_id?: number | null
          privacy_level?: string
          related_user_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          venue_id?: number | null
        }
        Update: {
          activity_type?: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          plan_id?: number | null
          privacy_level?: string
          related_user_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          venue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_feeds_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feeds_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          created_at: string
          crowd_level: number | null
          id: string
          location_accuracy: number | null
          mood: string | null
          notes: string | null
          plan_id: number | null
          privacy_level: string
          rating: number | null
          status: string
          user_id: string
          venue_id: number
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          crowd_level?: number | null
          id?: string
          location_accuracy?: number | null
          mood?: string | null
          notes?: string | null
          plan_id?: number | null
          privacy_level?: string
          rating?: number | null
          status?: string
          user_id: string
          venue_id: number
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          crowd_level?: number | null
          id?: string
          location_accuracy?: number | null
          mood?: string | null
          notes?: string | null
          plan_id?: number | null
          privacy_level?: string
          rating?: number | null
          status?: string
          user_id?: string
          venue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      co_planning_drafts: {
        Row: {
          all_can_edit: boolean | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          plan_date: string | null
          plan_time: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          all_can_edit?: boolean | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          plan_date?: string | null
          plan_time?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          all_can_edit?: boolean | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          plan_date?: string | null
          plan_time?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      co_planning_participants: {
        Row: {
          accepted_at: string | null
          can_edit: boolean | null
          draft_id: string
          id: string
          invited_at: string
          role: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          can_edit?: boolean | null
          draft_id: string
          id?: string
          invited_at?: string
          role?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          can_edit?: boolean | null
          draft_id?: string
          id?: string
          invited_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "co_planning_participants_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "co_planning_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_co_planning_participants_draft"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "co_planning_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_stops: {
        Row: {
          added_by: string | null
          created_at: string
          draft_id: string
          estimated_time: number | null
          id: string
          notes: string | null
          stop_order: number
          venue_id: number | null
          venue_name: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          draft_id: string
          estimated_time?: number | null
          id?: string
          notes?: string | null
          stop_order: number
          venue_id?: number | null
          venue_name: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          draft_id?: string
          estimated_time?: number | null
          id?: string
          notes?: string | null
          stop_order?: number
          venue_id?: number | null
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_stops_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "co_planning_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_stops_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          accepted_at: string | null
          created_at: string
          friend_id: string
          id: number
          status: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          friend_id: string
          id?: number
          status?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          friend_id?: string
          id?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      message_threads: {
        Row: {
          context: string | null
          created_at: string
          created_by: string
          draft_id: string | null
          id: string
          is_pinned: boolean | null
          last_message_at: string | null
          plan_id: number | null
          thread_type: string
          title: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          created_by: string
          draft_id?: string | null
          id?: string
          is_pinned?: boolean | null
          last_message_at?: string | null
          plan_id?: number | null
          thread_type?: string
          title?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          created_by?: string
          draft_id?: string | null
          id?: string
          is_pinned?: boolean | null
          last_message_at?: string | null
          plan_id?: number | null
          thread_type?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "co_planning_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          edited_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          sender_id: string
          thread_id: string
          venue_id: number | null
        }
        Insert: {
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          sender_id: string
          thread_id: string
          venue_id?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          sender_id?: string
          thread_id?: string
          venue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          notification_type: string
          related_plan_id: number | null
          related_thread_id: string | null
          related_user_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type: string
          related_plan_id?: number | null
          related_thread_id?: string | null
          related_user_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type?: string
          related_plan_id?: number | null
          related_thread_id?: string | null
          related_user_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_plan_id_fkey"
            columns: ["related_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_thread_id_fkey"
            columns: ["related_thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          check_in_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          plan_id: number | null
          privacy_level: string
          tags: string[] | null
          taken_at: string | null
          uploaded_at: string
          user_id: string
          venue_id: number | null
        }
        Insert: {
          caption?: string | null
          check_in_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          plan_id?: number | null
          privacy_level?: string
          tags?: string[] | null
          taken_at?: string | null
          uploaded_at?: string
          user_id: string
          venue_id?: number | null
        }
        Update: {
          caption?: string | null
          check_in_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          plan_id?: number | null
          privacy_level?: string
          tags?: string[] | null
          taken_at?: string | null
          uploaded_at?: string
          user_id?: string
          venue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_check_in_id_fkey"
            columns: ["check_in_id"]
            isOneToOne: false
            referencedRelation: "check_ins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_participants: {
        Row: {
          id: number
          invited_at: string
          plan_id: number
          responded_at: string | null
          role: string
          rsvp_status: string | null
          user_id: string
        }
        Insert: {
          id?: number
          invited_at?: string
          plan_id: number
          responded_at?: string | null
          role?: string
          rsvp_status?: string | null
          user_id: string
        }
        Update: {
          id?: number
          invited_at?: string
          plan_id?: number
          responded_at?: string | null
          role?: string
          rsvp_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_plan_participants_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_participants_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_stops: {
        Row: {
          cost: number | null
          created_at: string
          estimated_time: number | null
          id: number
          notes: string | null
          plan_id: number
          stop_order: number
          venue_id: number
        }
        Insert: {
          cost?: number | null
          created_at?: string
          estimated_time?: number | null
          id?: number
          notes?: string | null
          plan_id: number
          stop_order: number
          venue_id: number
        }
        Update: {
          cost?: number | null
          created_at?: string
          estimated_time?: number | null
          id?: number
          notes?: string | null
          plan_id?: number
          stop_order?: number
          venue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_stops_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_stops_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          attendees_count: number | null
          created_at: string
          creator_id: string
          description: string | null
          duration: string | null
          estimated_cost: string | null
          id: number
          name: string
          notes: string | null
          plan_date: string
          plan_time: string | null
          rsvp_cant_go: number | null
          rsvp_going: number | null
          rsvp_maybe: number | null
          share_link: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attendees_count?: number | null
          created_at?: string
          creator_id: string
          description?: string | null
          duration?: string | null
          estimated_cost?: string | null
          id?: number
          name: string
          notes?: string | null
          plan_date: string
          plan_time?: string | null
          rsvp_cant_go?: number | null
          rsvp_going?: number | null
          rsvp_maybe?: number | null
          share_link?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attendees_count?: number | null
          created_at?: string
          creator_id?: string
          description?: string | null
          duration?: string | null
          estimated_cost?: string | null
          id?: number
          name?: string
          notes?: string | null
          plan_date?: string
          plan_time?: string | null
          rsvp_cant_go?: number | null
          rsvp_going?: number | null
          rsvp_maybe?: number | null
          share_link?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      social_intelligence: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          friend_id: string
          id: string
          relevance_score: number | null
          user_id: string
          venue_id: number | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          friend_id: string
          id?: string
          relevance_score?: number | null
          user_id: string
          venue_id?: number | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          friend_id?: string
          id?: string
          relevance_score?: number | null
          user_id?: string
          venue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_intelligence_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          check_in_id: string | null
          content: string | null
          created_at: string
          id: string
          is_pinned: boolean | null
          mood: string | null
          photo_ids: string[] | null
          plan_id: number | null
          post_type: string
          privacy_level: string
          tags: string[] | null
          updated_at: string
          user_id: string
          venue_id: number | null
        }
        Insert: {
          check_in_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          mood?: string | null
          photo_ids?: string[] | null
          plan_id?: number | null
          post_type: string
          privacy_level?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
          venue_id?: number | null
        }
        Update: {
          check_in_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          mood?: string | null
          photo_ids?: string[] | null
          plan_id?: number | null
          post_type?: string
          privacy_level?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          venue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_check_in_id_fkey"
            columns: ["check_in_id"]
            isOneToOne: false
            referencedRelation: "check_ins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_participants: {
        Row: {
          id: string
          is_muted: boolean | null
          joined_at: string
          last_read_at: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: number
          user_id: string
          venue_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: string
          venue_id: number
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string
          venue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          activity: string | null
          current_location: Json | null
          last_seen: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity?: string | null
          current_location?: Json | null
          last_seen?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity?: string | null
          current_location?: Json | null
          last_seen?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_vibes: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          intensity: number | null
          is_active: boolean | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          updated_at: string
          user_id: string
          vibe_type: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          intensity?: number | null
          is_active?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          updated_at?: string
          user_id: string
          vibe_type: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          intensity?: number | null
          is_active?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          updated_at?: string
          user_id?: string
          vibe_type?: string
        }
        Relationships: []
      }
      venue_activity: {
        Row: {
          activity_date: string
          average_crowd_level: number | null
          average_rating: number | null
          check_in_count: number | null
          created_at: string
          hour_of_day: number
          id: string
          peak_crowd_time: string | null
          total_visitors: number | null
          updated_at: string
          venue_id: number
        }
        Insert: {
          activity_date: string
          average_crowd_level?: number | null
          average_rating?: number | null
          check_in_count?: number | null
          created_at?: string
          hour_of_day: number
          id?: string
          peak_crowd_time?: string | null
          total_visitors?: number | null
          updated_at?: string
          venue_id: number
        }
        Update: {
          activity_date?: string
          average_crowd_level?: number | null
          average_rating?: number | null
          check_in_count?: number | null
          created_at?: string
          hour_of_day?: number
          id?: string
          peak_crowd_time?: string | null
          total_visitors?: number | null
          updated_at?: string
          venue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "venue_activity_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string
          avg_cost: number | null
          created_at: string
          crowd_level: number | null
          estimated_time: number | null
          features: string[] | null
          id: number
          image_url: string | null
          is_open_now: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          price_level: number | null
          rating: number | null
          updated_at: string
          venue_type: string
          vibe: string | null
          website: string | null
        }
        Insert: {
          address: string
          avg_cost?: number | null
          created_at?: string
          crowd_level?: number | null
          estimated_time?: number | null
          features?: string[] | null
          id?: number
          image_url?: string | null
          is_open_now?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          price_level?: number | null
          rating?: number | null
          updated_at?: string
          venue_type?: string
          vibe?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          avg_cost?: number | null
          created_at?: string
          crowd_level?: number | null
          estimated_time?: number | null
          features?: string[] | null
          id?: number
          image_url?: string | null
          is_open_now?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          price_level?: number | null
          rating?: number | null
          updated_at?: string
          venue_type?: string
          vibe?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_access_draft: {
        Args: { draft_id: string; user_id: string }
        Returns: boolean
      }
      can_user_access_plan: {
        Args: { plan_id: number; user_id: string }
        Returns: boolean
      }
      cleanup_expired_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_vibes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_plan_role: {
        Args: { plan_id: number; user_id: string }
        Returns: string
      }
      is_draft_creator: {
        Args: { draft_id: string; user_id: string }
        Returns: boolean
      }
      is_plan_creator: {
        Args: { plan_id: number; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
