export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          region: string | null
          session_id: string | null
          subscriber_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          subscriber_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          subscriber_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      document_engagement: {
        Row: {
          action: string
          created_at: string | null
          document_type: string
          id: string
          session_id: string | null
          subscriber_id: string | null
          view_duration_seconds: number | null
          visitor_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          document_type: string
          id?: string
          session_id?: string | null
          subscriber_id?: string | null
          view_duration_seconds?: number | null
          visitor_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          document_type?: string
          id?: string
          session_id?: string | null
          subscriber_id?: string | null
          view_duration_seconds?: number | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_engagement_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      drip_campaign_status: {
        Row: {
          created_at: string
          email_1_sent_at: string | null
          email_2_sent_at: string | null
          email_3_sent_at: string | null
          email_4_sent_at: string | null
          email_5_sent_at: string | null
          id: string
          signup_id: string
          unsubscribed: boolean | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email_1_sent_at?: string | null
          email_2_sent_at?: string | null
          email_3_sent_at?: string | null
          email_4_sent_at?: string | null
          email_5_sent_at?: string | null
          id?: string
          signup_id: string
          unsubscribed?: boolean | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email_1_sent_at?: string | null
          email_2_sent_at?: string | null
          email_3_sent_at?: string | null
          email_4_sent_at?: string | null
          email_5_sent_at?: string | null
          id?: string
          signup_id?: string
          unsubscribed?: boolean | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drip_campaign_status_subscriber_id_fkey"
            columns: ["signup_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_events: {
        Row: {
          campaign_id: string | null
          email: string
          email_id: string | null
          event_type: string
          id: string
          ip_address: string | null
          link_url: string | null
          subscriber_id: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id?: string | null
          email: string
          email_id?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          link_url?: string | null
          subscriber_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string | null
          email?: string
          email_id?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          link_url?: string | null
          subscriber_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      live_visitors: {
        Row: {
          city: string | null
          country: string | null
          country_code: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          last_seen: string | null
          page_url: string | null
          referrer: string | null
          region: string | null
          session_id: string
          subscriber_id: string | null
          utm_source: string | null
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_seen?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          session_id: string
          subscriber_id?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_seen?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string
          subscriber_id?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      newsletter_signups: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          source: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          source?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          source?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      outbound_campaigns: {
        Row: {
          created_at: string
          id: string
          name: string
          sent_count: number | null
          subject_a: string
          subject_b: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sent_count?: number | null
          subject_a: string
          subject_b?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sent_count?: number | null
          subject_a?: string
          subject_b?: string | null
        }
        Relationships: []
      }
      outbound_email_log: {
        Row: {
          campaign_id: string | null
          email: string
          id: string
          mailgun_id: string | null
          sent_at: string
          subject_variant: string | null
        }
        Insert: {
          campaign_id?: string | null
          email: string
          id?: string
          mailgun_id?: string | null
          sent_at?: string
          subject_variant?: string | null
        }
        Update: {
          campaign_id?: string | null
          email?: string
          id?: string
          mailgun_id?: string | null
          sent_at?: string
          subject_variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbound_email_log_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outbound_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string
        }
        Insert: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          first_name: string
          id: string
          phone: string | null
          phone_verified: boolean | null
          sms_opted_in: boolean | null
          source: string | null
          status: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          first_name: string
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          sms_opted_in?: boolean | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          sms_opted_in?: boolean | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_analytics_summary: {
        Args: { end_date: string; live_since: string; start_date: string }
        Returns: {
          emails_clicked: number
          emails_opened: number
          emails_sent: number
          live_visitors: number
          new_visitors: number
          podcast_completes: number
          podcast_plays: number
          report_shares: number
          report_views: number
          returning_visitors: number
          sms_subscribers: number
          tearsheet_shares: number
          tearsheet_views: number
          total_hits: number
          total_pageviews: number
          total_revisits: number
          total_subscribers: number
          total_visitors: number
        }[]
      }
      get_country_breakdown: {
        Args: { end_date: string; max_rows?: number; start_date: string }
        Returns: {
          country: string
          country_code: string
          total_visitors: number
          visitors: number
        }[]
      }
      get_daily_analytics: {
        Args: { end_date: string; start_date: string }
        Returns: {
          day: string
          pageviews: number
          unique_visitors: number
        }[]
      }
      get_hot_leads: {
        Args: never
        Returns: {
          click_count: number
          email: string
          first_name: string
          open_count: number
        }[]
      }
      get_top_returning_visitors: {
        Args: { end_date: string; max_rows?: number; start_date: string }
        Returns: {
          country: string
          device_type: string
          first_seen: string
          last_seen: string
          total_events: number
          visit_days: number
          visitor_id: string
        }[]
      }
      get_traffic_breakdowns: {
        Args: { end_date: string; max_rows?: number; start_date: string }
        Returns: {
          dimension: string
          label: string
          visitors: number
        }[]
      }
      get_visitor_breakdown: {
        Args: { end_date: string; start_date: string }
        Returns: {
          new_visitors: number
          returning_visitors: number
          total_revisits: number
          total_visitors: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
