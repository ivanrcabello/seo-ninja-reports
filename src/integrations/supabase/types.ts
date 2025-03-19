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
      clients: {
        Row: {
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
    }
    Views: {
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
      [_ in never]: never
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
