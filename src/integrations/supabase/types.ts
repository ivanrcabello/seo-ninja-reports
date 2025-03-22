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
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          business_address: string | null
          business_category: string | null
          business_hours: Json | null
          business_name: string | null
          business_phone: string | null
          business_rating: number | null
          business_reviews_count: number | null
          business_url: string
          business_website: string | null
          created_at: string | null
          id: string
          report_id: string
          updated_at: string | null
        }
        Insert: {
          business_address?: string | null
          business_category?: string | null
          business_hours?: Json | null
          business_name?: string | null
          business_phone?: string | null
          business_rating?: number | null
          business_reviews_count?: number | null
          business_url: string
          business_website?: string | null
          created_at?: string | null
          id?: string
          report_id: string
          updated_at?: string | null
        }
        Update: {
          business_address?: string | null
          business_category?: string | null
          business_hours?: Json | null
          business_name?: string | null
          business_phone?: string | null
          business_rating?: number | null
          business_reviews_count?: number | null
          business_url?: string
          business_website?: string | null
          created_at?: string | null
          id?: string
          report_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "public_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_profiles_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contracts: {
        Row: {
          admin_signature: string | null
          admin_signed: boolean
          admin_signed_at: string | null
          client_id: string
          client_signature: string | null
          client_signed: boolean
          client_signed_at: string | null
          content: string
          created_at: string
          id: string
          shared_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_signature?: string | null
          admin_signed?: boolean
          admin_signed_at?: string | null
          client_id: string
          client_signature?: string | null
          client_signed?: boolean
          client_signed_at?: string | null
          content: string
          created_at?: string
          id?: string
          shared_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_signature?: string | null
          admin_signed?: boolean
          admin_signed_at?: string | null
          client_id?: string
          client_signature?: string | null
          client_signed?: boolean
          client_signed_at?: string | null
          content?: string
          created_at?: string
          id?: string
          shared_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_proposals: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          price: number | null
          services: string[] | null
          shared_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          services?: string[] | null
          shared_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          services?: string[] | null
          shared_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          created_at: string
          hosting_credentials: Json | null
          id: string
          industry: string | null
          name: string
          phone_number: string | null
          updated_at: string
          user_id: string
          website: string
          wp_credentials: Json | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          hosting_credentials?: Json | null
          id?: string
          industry?: string | null
          name: string
          phone_number?: string | null
          updated_at?: string
          user_id: string
          website: string
          wp_credentials?: Json | null
        }
        Update: {
          active?: boolean
          created_at?: string
          hosting_credentials?: Json | null
          id?: string
          industry?: string | null
          name?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
          website?: string
          wp_credentials?: Json | null
        }
        Relationships: []
      }
      google_business_listings: {
        Row: {
          address: string | null
          client_id: string | null
          created_at: string | null
          hours: string | null
          id: string
          phone: string | null
          place_id: string | null
          rating: number | null
          reviews: number | null
          title: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          hours?: string | null
          id?: string
          phone?: string | null
          place_id?: string | null
          rating?: number | null
          reviews?: number | null
          title: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          hours?: string | null
          id?: string
          phone?: string | null
          place_id?: string | null
          rating?: number | null
          reviews?: number | null
          title?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "google_business_listings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          created_at: string | null
          difficulty: number | null
          id: string
          keyword: string
          report_id: string
          search_volume: number | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: number | null
          id?: string
          keyword: string
          report_id: string
          search_volume?: number | null
        }
        Update: {
          created_at?: string | null
          difficulty?: number | null
          id?: string
          keyword?: string
          report_id?: string
          search_volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "keywords_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "public_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keywords_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pagespeed_data: {
        Row: {
          created_at: string | null
          desktop_accessibility: number | null
          desktop_best_practices: number | null
          desktop_cumulative_layout_shift: number | null
          desktop_first_contentful_paint: number | null
          desktop_largest_contentful_paint: number | null
          desktop_performance: number | null
          desktop_seo: number | null
          desktop_speed_index: number | null
          desktop_time_to_interactive: number | null
          desktop_total_blocking_time: number | null
          id: string
          mobile_accessibility: number | null
          mobile_best_practices: number | null
          mobile_cumulative_layout_shift: number | null
          mobile_first_contentful_paint: number | null
          mobile_largest_contentful_paint: number | null
          mobile_performance: number | null
          mobile_seo: number | null
          mobile_speed_index: number | null
          mobile_time_to_interactive: number | null
          mobile_total_blocking_time: number | null
          raw_data: Json | null
          report_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          desktop_accessibility?: number | null
          desktop_best_practices?: number | null
          desktop_cumulative_layout_shift?: number | null
          desktop_first_contentful_paint?: number | null
          desktop_largest_contentful_paint?: number | null
          desktop_performance?: number | null
          desktop_seo?: number | null
          desktop_speed_index?: number | null
          desktop_time_to_interactive?: number | null
          desktop_total_blocking_time?: number | null
          id?: string
          mobile_accessibility?: number | null
          mobile_best_practices?: number | null
          mobile_cumulative_layout_shift?: number | null
          mobile_first_contentful_paint?: number | null
          mobile_largest_contentful_paint?: number | null
          mobile_performance?: number | null
          mobile_seo?: number | null
          mobile_speed_index?: number | null
          mobile_time_to_interactive?: number | null
          mobile_total_blocking_time?: number | null
          raw_data?: Json | null
          report_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          desktop_accessibility?: number | null
          desktop_best_practices?: number | null
          desktop_cumulative_layout_shift?: number | null
          desktop_first_contentful_paint?: number | null
          desktop_largest_contentful_paint?: number | null
          desktop_performance?: number | null
          desktop_seo?: number | null
          desktop_speed_index?: number | null
          desktop_time_to_interactive?: number | null
          desktop_total_blocking_time?: number | null
          id?: string
          mobile_accessibility?: number | null
          mobile_best_practices?: number | null
          mobile_cumulative_layout_shift?: number | null
          mobile_first_contentful_paint?: number | null
          mobile_largest_contentful_paint?: number | null
          mobile_performance?: number | null
          mobile_seo?: number | null
          mobile_speed_index?: number | null
          mobile_time_to_interactive?: number | null
          mobile_total_blocking_time?: number | null
          raw_data?: Json | null
          report_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagespeed_data_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "public_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagespeed_data_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
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
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          client_id: string
          content: Json | null
          created_at: string
          custom_prompt: string | null
          date: string
          has_business_profile: boolean | null
          id: string
          notes: string | null
          status: string
          summary: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          client_id: string
          content?: Json | null
          created_at?: string
          custom_prompt?: string | null
          date?: string
          has_business_profile?: boolean | null
          id?: string
          notes?: string | null
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          client_id?: string
          content?: Json | null
          created_at?: string
          custom_prompt?: string | null
          date?: string
          has_business_profile?: boolean | null
          id?: string
          notes?: string | null
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_competitors: {
        Row: {
          competition_level: number | null
          created_at: string | null
          domain: string
          id: string
          keywords_overlap: number | null
          report_id: string
        }
        Insert: {
          competition_level?: number | null
          created_at?: string | null
          domain: string
          id?: string
          keywords_overlap?: number | null
          report_id: string
        }
        Update: {
          competition_level?: number | null
          created_at?: string | null
          domain?: string
          id?: string
          keywords_overlap?: number | null
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_competitors_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "seo_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string | null
          id: string
          keyword: string
          position: number | null
          report_id: string
          traffic_percent: number | null
          volume: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keyword: string
          position?: number | null
          report_id: string
          traffic_percent?: number | null
          volume?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keyword?: string
          position?: number | null
          report_id?: string
          traffic_percent?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_keywords_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "seo_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_reports: {
        Row: {
          backlinks: number | null
          client_id: string
          created_at: string | null
          domain: string
          id: string
          keywords: number | null
          traffic: number | null
          updated_at: string | null
        }
        Insert: {
          backlinks?: number | null
          client_id: string
          created_at?: string | null
          domain: string
          id?: string
          keywords?: number | null
          traffic?: number | null
          updated_at?: string | null
        }
        Update: {
          backlinks?: number | null
          client_id?: string
          created_at?: string | null
          domain?: string
          id?: string
          keywords?: number | null
          traffic?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          default_prompt: string | null
          google_business_key: string | null
          google_key: string | null
          id: number
          logo_url: string | null
          openai_key: string | null
          updated_at: string
          value_serp_key: string | null
        }
        Insert: {
          created_at?: string
          default_prompt?: string | null
          google_business_key?: string | null
          google_key?: string | null
          id: number
          logo_url?: string | null
          openai_key?: string | null
          updated_at?: string
          value_serp_key?: string | null
        }
        Update: {
          created_at?: string
          default_prompt?: string | null
          google_business_key?: string | null
          google_key?: string | null
          id?: number
          logo_url?: string | null
          openai_key?: string | null
          updated_at?: string
          value_serp_key?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_contracts: {
        Row: {
          admin_signature: string | null
          admin_signed: boolean | null
          admin_signed_at: string | null
          client_name: string | null
          client_signature: string | null
          client_signed: boolean | null
          client_signed_at: string | null
          client_website: string | null
          content: string | null
          created_at: string | null
          id: string | null
          shared_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      public_proposals: {
        Row: {
          client_name: string | null
          client_website: string | null
          created_at: string | null
          description: string | null
          id: string | null
          price: number | null
          services: string[] | null
          shared_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      public_reports: {
        Row: {
          client_name: string | null
          client_website: string | null
          content: Json | null
          date: string | null
          id: string | null
          status: string | null
          summary: string | null
          title: string | null
          url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_settings_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
