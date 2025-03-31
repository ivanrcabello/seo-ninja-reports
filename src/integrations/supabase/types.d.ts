export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          business_address: string | null
          business_category: string | null
          business_hours: string | null
          business_name: string | null
          business_phone: string | null
          business_rating: number | null
          business_reviews_count: number | null
          business_url: string | null
          business_website: string | null
          created_at: string
          id: string
          last_scraped_at: string | null
          updated_at: string | null
        }
        Insert: {
          business_address?: string | null
          business_category?: string | null
          business_hours?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_rating?: number | null
          business_reviews_count?: number | null
          business_url?: string | null
          business_website?: string | null
          created_at?: string
          id?: string
          last_scraped_at?: string | null
          updated_at?: string | null
        }
        Update: {
          business_address?: string | null
          business_category?: string | null
          business_hours?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_rating?: number | null
          business_reviews_count?: number | null
          business_url?: string | null
          business_website?: string | null
          created_at?: string
          id?: string
          last_scraped_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          admin_signed: boolean | null
          admin_signed_at: string | null
          admin_signature: string | null
          client_name: string | null
          client_signed: boolean | null
          client_signed_at: string | null
          client_signature: string | null
          client_website: string | null
          content: string | null
          created_at: string
          id: string
          shared_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          admin_signed?: boolean | null
          admin_signed_at?: string | null
          admin_signature?: string | null
          client_name?: string | null
          client_signed?: boolean | null
          client_signed_at?: string | null
          client_signature?: string | null
          client_website?: string | null
          content?: string | null
          created_at?: string
          id?: string
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_signed?: boolean | null
          admin_signed_at?: string | null
          admin_signature?: string | null
          client_name?: string | null
          client_signed?: boolean | null
          client_signed_at?: string | null
          client_signature?: string | null
          client_website?: string | null
          content?: string | null
          created_at?: string
          id?: string
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      keywords: {
        Row: {
          created_at: string
          difficulty: number | null
          id: string
          keyword: string | null
          report_id: string | null
          search_volume: number | null
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          id?: string
          keyword?: string | null
          report_id?: string | null
          search_volume?: number | null
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          id?: string
          keyword?: string | null
          report_id?: string | null
          search_volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "keywords_report_id_fkey"
            columns: ["report_id"]
            isOne: true
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
      proposals: {
        Row: {
          client_name: string | null
          client_website: string | null
          created_at: string
          description: string | null
          id: string
          price: number | null
          services: Json | null
          shared_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          client_website?: string | null
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          services?: Json | null
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          client_website?: string | null
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          services?: Json | null
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_invoices: {
        Row: {
          amount: number | null
          client_name: string | null
          client_website: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          payment_date: string | null
          payment_instructions: string | null
          payment_method: string | null
          shared_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          client_name?: string | null
          client_website?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          payment_date?: string | null
          payment_instructions?: string | null
          payment_method?: string | null
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          client_name?: string | null
          client_website?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          payment_date?: string | null
          payment_instructions?: string | null
          payment_method?: string | null
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          clientId: string | null
          content: Json | null
          created_at: string
          date: string | null
          hasBusinessProfile: boolean | null
          id: string
          notes: string | null
          seoReport: Json | null
          status: string | null
          summary: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          clientId?: string | null
          content?: Json | null
          created_at?: string
          date?: string | null
          hasBusinessProfile?: boolean | null
          id?: string
          notes?: string | null
          seoReport?: Json | null
          status?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          clientId?: string | null
          content?: Json | null
          created_at?: string
          date?: string | null
          hasBusinessProfile?: boolean | null
          id?: string
          notes?: string | null
          seoReport?: Json | null
          status?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          default_prompt: string | null
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
          google_key?: string | null
          id?: number
          logo_url?: string | null
          openai_key?: string | null
          updated_at?: string
          value_serp_key?: string | null
        }
        Relationships: []
      }
      seo_crawler_crawl_pages: {
        Row: {
          crawl_id: string | null
          created_at: string
          html_content: string | null
          id: string
          page_url: string | null
          status_code: number | null
        }
        Insert: {
          crawl_id?: string | null
          created_at?: string
          html_content?: string | null
          id?: string
          page_url?: string | null
          status_code?: number | null
        }
        Update: {
          crawl_id?: string | null
          created_at?: string
          html_content?: string | null
          id?: string
          page_url?: string | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_crawl_pages_crawl_id_fkey"
            columns: ["crawl_id"]
            isOne: true
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_crawler_crawls: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          status: string | null
          target_url: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          status?: string | null
          target_url?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          status?: string | null
          target_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_crawls_client_id_fkey"
            columns: ["client_id"]
            isOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_crawler_headings: {
        Row: {
          content: string | null
          crawl_id: string | null
          heading_position: number | null
          heading_type: string | null
          id: string
          page_id: string | null
        }
        Insert: {
          content?: string | null
          crawl_id?: string | null
          heading_position?: number | null
          heading_type?: string | null
          id?: string
          page_id?: string | null
        }
        Update: {
          content?: string | null
          crawl_id?: string | null
          heading_position?: number | null
          heading_type?: string | null
          id?: string
          page_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_headings_crawl_id_fkey"
            columns: ["crawl_id"]
            isOne: true
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_crawler_headings_page_id_fkey"
            columns: ["page_id"]
            isOne: true
            referencedRelation: "seo_crawler_crawl_pages"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_reports: {
        Row: {
          backlinks: number | null
          client_id: string | null
          created_at: string
          domain: string | null
          id: string
          keywords: number | null
          traffic: number | null
          updated_at: string | null
        }
        Insert: {
          backlinks?: number | null
          client_id?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          keywords?: number | null
          traffic?: number | null
          updated_at?: string | null
        }
        Update: {
          backlinks?: number | null
          client_id?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          keywords?: number | null
          traffic?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_reports_client_id_fkey"
            columns: ["client_id"]
            isOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      public_proposals: {
        Row: {
          client_name: string | null
          client_website: string | null
          created_at: string | null
          description: string | null
          id: string | null
          price: number | null
          services: Json | null
          shared_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          client_website?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          price?: number | null
          services?: Json | null
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          client_website?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          price?: number | null
          services?: Json | null
          shared_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
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
        Insert: {
          client_name?: string | null
          client_website?: string | null
          content?: Json | null
          date?: string | null
          id?: string | null
          status?: string | null
          summary?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          client_name?: string | null
          client_website?: string | null
          content?: Json | null
          date?: string | null
          id?: string | null
          status?: string | null
          summary?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_invoice_password_protection: {
        Args: {
          shared_url_param: string
        }
        Returns: boolean
      }
      check_proposal_password_protection: {
        Args: {
          shared_url_param: string
        }
        Returns: boolean
      }
      check_report_password_protection: {
        Args: {
          report_id_param: string
        }
        Returns: boolean
      }
      create_settings_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_crawl_headings: {
        Args: {
          crawl_id_param: string
        }
        Returns: {
          id: string
          crawl_id: string
          page_id: string
          page_url: string
          heading_type: string
          content: string
          heading_position: number
        }[]
      }
      get_page_headings: {
        Args: {
          page_id_param: string
        }
        Returns: {
          id: string
          crawl_id: string
          page_id: string
          page_url: string
          heading_type: string
          content: string
          heading_position: number
        }[]
      }
      get_public_contract_by_shared_url: {
        Args: {
          shared_url_param: string
        }
        Returns: {
          id: string
          title: string
          content: string
          client_name: string
          client_website: string
          status: string
          created_at: string
          updated_at: string
          client_signed: boolean
          client_signed_at: string
          client_signature: string
          admin_signed: boolean
          admin_signed_at: string
          admin_signature: string
          shared_url: string
        }[]
      }
      get_public_invoice_by_shared_url: {
        Args: {
          shared_url_param: string
        }
        Returns: {
          id: string
          title: string
          description: string
          amount: number
          status: string
          due_date: string
          payment_method: string
          payment_date: string
          payment_instructions: string
          shared_url: string
          created_at: string
          updated_at: string
          client_name: string
          client_website: string
        }[]
      }
      update_contract_by_shared_url: {
        Args: {
          shared_url_param: string
          client_signed_param: boolean
          client_signed_at_param: string
          client_signature_param: string
          status_param?: string
        }
        Returns: string
      }
      verify_shared_invoice_password: {
        Args: {
          shared_url_param: string
          password_param: string
        }
        Returns: boolean
      }
      verify_shared_proposal_password: {
        Args: {
          shared_url_param: string
          password_param: string
        }
        Returns: boolean
      }
      verify_shared_report_password: {
        Args: {
          report_id_param: string
          password_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      contract_status: "draft" | "sent" | "accepted" | "rejected"
      invoice_status: "pending" | "paid" | "cancelled" | "overdue"
      report_status: "processing" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
