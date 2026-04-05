// Gerado automaticamente via: supabase gen types typescript --project-id SEU_ID > src/lib/database.types.ts
// Execute o comando acima após configurar o projeto no Supabase.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; name: string; created_at: string }
        Insert: { id?: string; email: string; name: string; created_at?: string }
        Update: { id?: string; email?: string; name?: string }
      }
      garment_templates: {
        Row: {
          id: string
          name: string
          type: 'jersey_short' | 'jersey_long' | 'bib_shorts'
          svg_template_url: string
          model_3d_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'jersey_short' | 'jersey_long' | 'bib_shorts'
          svg_template_url: string
          model_3d_url: string
        }
        Update: Partial<Database['public']['Tables']['garment_templates']['Insert']>
      }
      garment_zones: {
        Row: {
          id: string
          template_id: string
          zone_name: string
          label: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          zone_name: string
          label: string
          metadata: Json
        }
        Update: Partial<Database['public']['Tables']['garment_zones']['Insert']>
      }
      designs: {
        Row: {
          id: string
          user_id: string
          template_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: { name?: string; updated_at?: string }
      }
      design_versions: {
        Row: {
          id: string
          design_id: string
          version_number: number
          config_json: Json
          preview_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          design_id: string
          version_number: number
          config_json: Json
          preview_image_url?: string | null
        }
        Update: { preview_image_url?: string }
      }
      brand_assets: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          file_url: string
        }
        Update: Partial<Database['public']['Tables']['brand_assets']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
