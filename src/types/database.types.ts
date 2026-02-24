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
      posts: {
        Row: {
          id: string
          created_at: string
          content_es: string
          content_en: string
          image_urls: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          content_es: string
          content_en: string
          image_urls?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          content_es?: string
          content_en?: string
          image_urls?: string[] | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          slug: string
          name: string
          is_active: boolean | null
          start_date: string | null
          end_date: string | null
          url: string | null
          logo_url: string | null
          short_description_es: string | null
          history_es: string | null
          short_description_en: string | null
          history_en: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          slug: string
          name: string
          is_active?: boolean | null
          start_date?: string | null
          end_date?: string | null
          url?: string | null
          logo_url?: string | null
          short_description_es?: string | null
          history_es?: string | null
          short_description_en?: string | null
          history_en?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          slug?: string
          name?: string
          is_active?: boolean | null
          start_date?: string | null
          end_date?: string | null
          url?: string | null
          logo_url?: string | null
          short_description_es?: string | null
          history_es?: string | null
          short_description_en?: string | null
          history_en?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
