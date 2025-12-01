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
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          is_premium: boolean
          stripe_customer_id: string | null
          subscription_status: 'active' | 'canceled' | 'expired' | null
          subscription_end_date: string | null
          generations_today: number
          last_generation_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          is_premium?: boolean
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'expired' | null
          subscription_end_date?: string | null
          generations_today?: number
          last_generation_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          is_premium?: boolean
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'expired' | null
          subscription_end_date?: string | null
          generations_today?: number
          last_generation_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      names: {
        Row: {
          id: string
          name: string
          gender: 'male' | 'female' | 'unisex'
          origin: string | null
          meaning: string | null
          characteristics: string[] | null
          popularity_score: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          gender: 'male' | 'female' | 'unisex'
          origin?: string | null
          meaning?: string | null
          characteristics?: string[] | null
          popularity_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          gender?: 'male' | 'female' | 'unisex'
          origin?: string | null
          meaning?: string | null
          characteristics?: string[] | null
          popularity_score?: number
          created_at?: string
        }
      }
      user_seen_names: {
        Row: {
          id: string
          user_id: string
          name_id: string
          seen_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name_id: string
          seen_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name_id?: string
          seen_at?: string
        }
      }
      shortlist: {
        Row: {
          id: string
          user_id: string
          name_id: string
          notes: string | null
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name_id: string
          notes?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name_id?: string
          notes?: string | null
          added_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          is_public: boolean
          invite_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          is_public?: boolean
          invite_code?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          invite_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      list_members: {
        Row: {
          id: string
          list_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          joined_at: string
        }
        Insert: {
          id?: string
          list_id: string
          user_id: string
          role?: 'owner' | 'editor' | 'viewer'
          joined_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          user_id?: string
          role?: 'owner' | 'editor' | 'viewer'
          joined_at?: string
        }
      }
      list_names: {
        Row: {
          id: string
          list_id: string
          name_id: string
          added_by: string
          added_at: string
        }
        Insert: {
          id?: string
          list_id: string
          name_id: string
          added_by: string
          added_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name_id?: string
          added_by?: string
          added_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Name = Database['public']['Tables']['names']['Row']
export type Shortlist = Database['public']['Tables']['shortlist']['Row']
export type List = Database['public']['Tables']['lists']['Row']
export type ListMember = Database['public']['Tables']['list_members']['Row']
export type ListName = Database['public']['Tables']['list_names']['Row']

export interface NameData {
  name: string
  gender: 'male' | 'female' | 'unisex'
  origin?: string
  meaning?: string
  characteristics?: string[]
  popularity_score?: number
}
