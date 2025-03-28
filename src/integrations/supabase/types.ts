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
      client_invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          password: string | null
          payment_date: string | null
          payment_instructions: string | null
          payment_method: string | null
          shared_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          password?: string | null
          payment_date?: string | null
          payment_instructions?: string | null
          payment_method?: string | null
          shared_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          password?: string | null
          payment_date?: string | null
          payment_instructions?: string | null
          payment_method?: string | null
          shared_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_invoices_client_id_fkey"
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
      client_portal_accounts: {
        Row: {
          client_id: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_portal_accounts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portal_activity_logs: {
        Row: {
          action: string
          client_portal_account_id: string
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          client_portal_account_id: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          client_portal_account_id?: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_portal_activity_logs_client_portal_account_id_fkey"
            columns: ["client_portal_account_id"]
            isOneToOne: false
            referencedRelation: "client_portal_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portal_sessions: {
        Row: {
          client_portal_account_id: string
          created_at: string
          expires_at: string
          id: string
          token: string
        }
        Insert: {
          client_portal_account_id: string
          created_at?: string
          expires_at: string
          id?: string
          token: string
        }
        Update: {
          client_portal_account_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_portal_sessions_client_portal_account_id_fkey"
            columns: ["client_portal_account_id"]
            isOneToOne: false
            referencedRelation: "client_portal_accounts"
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
          password: string | null
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
          password?: string | null
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
          password?: string | null
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
      client_tasks: {
        Row: {
          assigned_to: string | null
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tasks_client_id_fkey"
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
          password: string | null
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
          password?: string | null
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
          password?: string | null
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
      seo_crawl_issues: {
        Row: {
          description: string
          id: string
          issue_type: string
          page_id: string | null
          recommended_fix: string | null
          severity: string
        }
        Insert: {
          description: string
          id?: string
          issue_type: string
          page_id?: string | null
          recommended_fix?: string | null
          severity: string
        }
        Update: {
          description?: string
          id?: string
          issue_type?: string
          page_id?: string | null
          recommended_fix?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawl_issues_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_crawl_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawl_links: {
        Row: {
          anchor_text: string | null
          follow: boolean | null
          id: string
          is_broken: boolean | null
          is_internal: boolean | null
          page_id: string | null
          status_code: number | null
          url: string
        }
        Insert: {
          anchor_text?: string | null
          follow?: boolean | null
          id?: string
          is_broken?: boolean | null
          is_internal?: boolean | null
          page_id?: string | null
          status_code?: number | null
          url: string
        }
        Update: {
          anchor_text?: string | null
          follow?: boolean | null
          id?: string
          is_broken?: boolean | null
          is_internal?: boolean | null
          page_id?: string | null
          status_code?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawl_links_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_crawl_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawl_pages: {
        Row: {
          canonical_url: string | null
          content_length: number | null
          crawl_id: string | null
          external_links_count: number | null
          h1: string | null
          h2_count: number | null
          h3_count: number | null
          has_schema_markup: boolean | null
          id: string
          image_count: number | null
          images_without_alt: number | null
          internal_links_count: number | null
          is_indexable: boolean | null
          load_time_ms: number | null
          meta_description: string | null
          meta_robots: string | null
          mobile_friendly: boolean | null
          page_size_kb: number | null
          robots_directives: string | null
          status_code: number | null
          title: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          content_length?: number | null
          crawl_id?: string | null
          external_links_count?: number | null
          h1?: string | null
          h2_count?: number | null
          h3_count?: number | null
          has_schema_markup?: boolean | null
          id?: string
          image_count?: number | null
          images_without_alt?: number | null
          internal_links_count?: number | null
          is_indexable?: boolean | null
          load_time_ms?: number | null
          meta_description?: string | null
          meta_robots?: string | null
          mobile_friendly?: boolean | null
          page_size_kb?: number | null
          robots_directives?: string | null
          status_code?: number | null
          title?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          content_length?: number | null
          crawl_id?: string | null
          external_links_count?: number | null
          h1?: string | null
          h2_count?: number | null
          h3_count?: number | null
          has_schema_markup?: boolean | null
          id?: string
          image_count?: number | null
          images_without_alt?: number | null
          internal_links_count?: number | null
          is_indexable?: boolean | null
          load_time_ms?: number | null
          meta_description?: string | null
          meta_robots?: string | null
          mobile_friendly?: boolean | null
          page_size_kb?: number | null
          robots_directives?: string | null
          status_code?: number | null
          title?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawl_pages_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawl_results"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawl_results: {
        Row: {
          client_id: string | null
          crawl_date: string | null
          domain: string
          id: string
          issues_count: number | null
          pages_crawled: number | null
          status: string | null
          total_time_seconds: number | null
        }
        Insert: {
          client_id?: string | null
          crawl_date?: string | null
          domain: string
          id?: string
          issues_count?: number | null
          pages_crawled?: number | null
          status?: string | null
          total_time_seconds?: number | null
        }
        Update: {
          client_id?: string | null
          crawl_date?: string | null
          domain?: string
          id?: string
          issues_count?: number | null
          pages_crawled?: number | null
          status?: string | null
          total_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawl_results_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawl_settings: {
        Row: {
          client_id: string | null
          created_at: string | null
          domain: string
          exclude_patterns: string[] | null
          follow_external_links: boolean | null
          id: string
          include_patterns: string[] | null
          max_pages: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          domain: string
          exclude_patterns?: string[] | null
          follow_external_links?: boolean | null
          id?: string
          include_patterns?: string[] | null
          max_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          domain?: string
          exclude_patterns?: string[] | null
          follow_external_links?: boolean | null
          id?: string
          include_patterns?: string[] | null
          max_pages?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawl_settings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_crawls: {
        Row: {
          avg_page_load_time_ms: number | null
          client_id: string | null
          completed_at: string | null
          crawl_depth: number | null
          domain: string
          duplicate_content_count: number | null
          error_message: string | null
          id: string
          inserted_at: string | null
          mobile_friendly_score: number | null
          pages_crawled: number | null
          performance_score: number | null
          schema_markup_count: number | null
          settings: Json
          started_at: string | null
          status: string
          summary: Json | null
          total_broken_links: number | null
          total_external_links: number | null
          total_internal_links: number | null
          total_issues: number | null
          total_links: number | null
          total_pages: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          avg_page_load_time_ms?: number | null
          client_id?: string | null
          completed_at?: string | null
          crawl_depth?: number | null
          domain: string
          duplicate_content_count?: number | null
          error_message?: string | null
          id?: string
          inserted_at?: string | null
          mobile_friendly_score?: number | null
          pages_crawled?: number | null
          performance_score?: number | null
          schema_markup_count?: number | null
          settings: Json
          started_at?: string | null
          status?: string
          summary?: Json | null
          total_broken_links?: number | null
          total_external_links?: number | null
          total_internal_links?: number | null
          total_issues?: number | null
          total_links?: number | null
          total_pages?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          avg_page_load_time_ms?: number | null
          client_id?: string | null
          completed_at?: string | null
          crawl_depth?: number | null
          domain?: string
          duplicate_content_count?: number | null
          error_message?: string | null
          id?: string
          inserted_at?: string | null
          mobile_friendly_score?: number | null
          pages_crawled?: number | null
          performance_score?: number | null
          schema_markup_count?: number | null
          settings?: Json
          started_at?: string | null
          status?: string
          summary?: Json | null
          total_broken_links?: number | null
          total_external_links?: number | null
          total_internal_links?: number | null
          total_issues?: number | null
          total_links?: number | null
          total_pages?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_crawls_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_headings: {
        Row: {
          content: string
          crawl_id: string | null
          created_at: string | null
          heading_type: string
          id: string
          page_id: string | null
          position: number
        }
        Insert: {
          content: string
          crawl_id?: string | null
          created_at?: string | null
          heading_type: string
          id?: string
          page_id?: string | null
          position?: number
        }
        Update: {
          content?: string
          crawl_id?: string | null
          created_at?: string | null
          heading_type?: string
          id?: string
          page_id?: string | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_headings_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_crawler_headings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page2_id"]
          },
          {
            foreignKeyName: "seo_crawler_headings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page1_id"]
          },
          {
            foreignKeyName: "seo_crawler_headings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_issues: {
        Row: {
          category: string | null
          crawl_id: string | null
          description: string
          element: string | null
          fix_suggestion: string | null
          id: string
          issue_type: string
          page_id: string | null
          page_url: string | null
          recommended_fix: string | null
          severity: string
        }
        Insert: {
          category?: string | null
          crawl_id?: string | null
          description: string
          element?: string | null
          fix_suggestion?: string | null
          id?: string
          issue_type: string
          page_id?: string | null
          page_url?: string | null
          recommended_fix?: string | null
          severity: string
        }
        Update: {
          category?: string | null
          crawl_id?: string | null
          description?: string
          element?: string | null
          fix_suggestion?: string | null
          id?: string
          issue_type?: string
          page_id?: string | null
          page_url?: string | null
          recommended_fix?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_issues_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_crawler_issues_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page2_id"]
          },
          {
            foreignKeyName: "seo_crawler_issues_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page1_id"]
          },
          {
            foreignKeyName: "seo_crawler_issues_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_links: {
        Row: {
          anchor_text: string | null
          crawl_id: string | null
          follow: boolean | null
          id: string
          is_broken: boolean | null
          is_internal: boolean | null
          link_location: string | null
          link_text: string | null
          link_type: string | null
          nofollow: boolean | null
          page_id: string | null
          rel_attributes: string[] | null
          status_code: number | null
          url: string
        }
        Insert: {
          anchor_text?: string | null
          crawl_id?: string | null
          follow?: boolean | null
          id?: string
          is_broken?: boolean | null
          is_internal?: boolean | null
          link_location?: string | null
          link_text?: string | null
          link_type?: string | null
          nofollow?: boolean | null
          page_id?: string | null
          rel_attributes?: string[] | null
          status_code?: number | null
          url: string
        }
        Update: {
          anchor_text?: string | null
          crawl_id?: string | null
          follow?: boolean | null
          id?: string
          is_broken?: boolean | null
          is_internal?: boolean | null
          link_location?: string | null
          link_text?: string | null
          link_type?: string | null
          nofollow?: boolean | null
          page_id?: string | null
          rel_attributes?: string[] | null
          status_code?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_links_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_crawler_links_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page2_id"]
          },
          {
            foreignKeyName: "seo_crawler_links_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page1_id"]
          },
          {
            foreignKeyName: "seo_crawler_links_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_pages: {
        Row: {
          canonical_url: string | null
          content_hash: string | null
          content_length: number | null
          content_similarity_score: number | null
          content_text: string | null
          content_type: string | null
          crawl_id: string | null
          crawled_at: string | null
          dom_load_time_ms: number | null
          dom_nodes_count: number | null
          external_links_count: number | null
          h1: string | null
          h2_count: number | null
          h3_count: number | null
          has_schema_markup: boolean | null
          headings: Json | null
          hreflang_count: number | null
          id: string
          image_count: number | null
          image_data: Json | null
          images_without_alt: number | null
          internal_links_count: number | null
          is_indexable: boolean | null
          issues_count: number | null
          level: number | null
          load_time_ms: number | null
          meta_description: string | null
          meta_keywords: string | null
          meta_robots: string | null
          mobile_friendly: boolean | null
          open_graph_data: Json | null
          page_size_kb: number | null
          redirect_url: string | null
          response_time_ms: number | null
          robots_directives: string | null
          schema_markup: Json | null
          similar_page_id: string | null
          status_code: number | null
          text_ratio: number | null
          title: string | null
          twitter_card_data: Json | null
          url: string
          word_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          content_hash?: string | null
          content_length?: number | null
          content_similarity_score?: number | null
          content_text?: string | null
          content_type?: string | null
          crawl_id?: string | null
          crawled_at?: string | null
          dom_load_time_ms?: number | null
          dom_nodes_count?: number | null
          external_links_count?: number | null
          h1?: string | null
          h2_count?: number | null
          h3_count?: number | null
          has_schema_markup?: boolean | null
          headings?: Json | null
          hreflang_count?: number | null
          id?: string
          image_count?: number | null
          image_data?: Json | null
          images_without_alt?: number | null
          internal_links_count?: number | null
          is_indexable?: boolean | null
          issues_count?: number | null
          level?: number | null
          load_time_ms?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_robots?: string | null
          mobile_friendly?: boolean | null
          open_graph_data?: Json | null
          page_size_kb?: number | null
          redirect_url?: string | null
          response_time_ms?: number | null
          robots_directives?: string | null
          schema_markup?: Json | null
          similar_page_id?: string | null
          status_code?: number | null
          text_ratio?: number | null
          title?: string | null
          twitter_card_data?: Json | null
          url: string
          word_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          content_hash?: string | null
          content_length?: number | null
          content_similarity_score?: number | null
          content_text?: string | null
          content_type?: string | null
          crawl_id?: string | null
          crawled_at?: string | null
          dom_load_time_ms?: number | null
          dom_nodes_count?: number | null
          external_links_count?: number | null
          h1?: string | null
          h2_count?: number | null
          h3_count?: number | null
          has_schema_markup?: boolean | null
          headings?: Json | null
          hreflang_count?: number | null
          id?: string
          image_count?: number | null
          image_data?: Json | null
          images_without_alt?: number | null
          internal_links_count?: number | null
          is_indexable?: boolean | null
          issues_count?: number | null
          level?: number | null
          load_time_ms?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_robots?: string | null
          mobile_friendly?: boolean | null
          open_graph_data?: Json | null
          page_size_kb?: number | null
          redirect_url?: string | null
          response_time_ms?: number | null
          robots_directives?: string | null
          schema_markup?: Json | null
          similar_page_id?: string | null
          status_code?: number | null
          text_ratio?: number | null
          title?: string | null
          twitter_card_data?: Json | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_pages_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_performance: {
        Row: {
          crawl_id: string | null
          created_at: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          page_id: string | null
        }
        Insert: {
          crawl_id?: string | null
          created_at?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          page_id?: string | null
        }
        Update: {
          crawl_id?: string | null
          created_at?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          page_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_performance_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_crawls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_crawler_performance_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page2_id"]
          },
          {
            foreignKeyName: "seo_crawler_performance_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "duplicate_content_view"
            referencedColumns: ["page1_id"]
          },
          {
            foreignKeyName: "seo_crawler_performance_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_settings: {
        Row: {
          client_id: string | null
          crawl_sitemap: boolean | null
          created_at: string | null
          custom_headers: Json | null
          domain: string
          exclude_patterns: string[] | null
          follow_external_links: boolean | null
          follow_links: boolean | null
          id: string
          include_patterns: string[] | null
          max_depth: number | null
          max_pages: number | null
          respect_robots_txt: boolean | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          client_id?: string | null
          crawl_sitemap?: boolean | null
          created_at?: string | null
          custom_headers?: Json | null
          domain: string
          exclude_patterns?: string[] | null
          follow_external_links?: boolean | null
          follow_links?: boolean | null
          id?: string
          include_patterns?: string[] | null
          max_depth?: number | null
          max_pages?: number | null
          respect_robots_txt?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          client_id?: string | null
          crawl_sitemap?: boolean | null
          created_at?: string | null
          custom_headers?: Json | null
          domain?: string
          exclude_patterns?: string[] | null
          follow_external_links?: boolean | null
          follow_links?: boolean | null
          id?: string
          include_patterns?: string[] | null
          max_depth?: number | null
          max_pages?: number | null
          respect_robots_txt?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_settings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_crawler_visualizations: {
        Row: {
          crawl_id: string | null
          created_at: string | null
          data: Json
          description: string | null
          id: string
          title: string
          visualization_type: string
        }
        Insert: {
          crawl_id?: string | null
          created_at?: string | null
          data: Json
          description?: string | null
          id?: string
          title: string
          visualization_type: string
        }
        Update: {
          crawl_id?: string | null
          created_at?: string | null
          data?: Json
          description?: string | null
          id?: string
          title?: string
          visualization_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_crawler_visualizations_crawl_id_fkey"
            columns: ["crawl_id"]
            isOneToOne: false
            referencedRelation: "seo_crawler_crawls"
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
      duplicate_content_view: {
        Row: {
          content_similarity_score: number | null
          page1_id: string | null
          page1_url: string | null
          page2_id: string | null
          page2_url: string | null
        }
        Relationships: []
      }
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
      public_invoices: {
        Row: {
          amount: number | null
          client_name: string | null
          client_website: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string | null
          payment_date: string | null
          payment_method: string | null
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
      authenticate_client_portal_account:
        | {
            Args: {
              p_email: string
              p_password: string
            }
            Returns: {
              account_id: string
              client_id: string
              token: string
              expires_at: string
            }[]
          }
        | {
            Args: {
              p_email: string
              p_password: string
              p_session_hours?: number
            }
            Returns: {
              account_id: string
              client_id: string
              token: string
              expires_at: string
            }[]
          }
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
      create_client_portal_account: {
        Args: {
          p_client_id: string
          p_email: string
          p_password: string
        }
        Returns: string
      }
      create_settings_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_secure_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_client_accounts_for_client_portal: {
        Args: Record<PropertyKey, never>
        Returns: string[]
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
      invalidate_client_portal_session: {
        Args: {
          p_token: string
        }
        Returns: boolean
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
      validate_client_portal_session: {
        Args: {
          p_token: string
        }
        Returns: {
          account_id: string
          client_id: string
          email: string
          is_valid: boolean
        }[]
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
