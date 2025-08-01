export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      government_schemes: {
        Row: {
          application_deadline: string | null
          benefits: string
          created_at: string
          description: string
          district: string | null
          eligibility_criteria: string
          id: string
          is_active: boolean | null
          state: string | null
          title: string
        }
        Insert: {
          application_deadline?: string | null
          benefits: string
          created_at?: string
          description: string
          district?: string | null
          eligibility_criteria: string
          id?: string
          is_active?: boolean | null
          state?: string | null
          title: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string
          created_at?: string
          description?: string
          district?: string | null
          eligibility_criteria?: string
          id?: string
          is_active?: boolean | null
          state?: string | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          quantity: number | null
          saree_id: string
          shipping_address: Json | null
          status: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          quantity?: number | null
          saree_id: string
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          quantity?: number | null
          saree_id?: string
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_saree_id_fkey"
            columns: ["saree_id"]
            isOneToOne: false
            referencedRelation: "sarees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          parent_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          society_name: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          parent_id?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          society_name?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          society_name?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_updates: {
        Row: {
          created_at: string
          id: string
          images: string[] | null
          message: string | null
          order_id: string
          status: string
          weaver_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          images?: string[] | null
          message?: string | null
          order_id: string
          status: string
          weaver_id: string
        }
        Update: {
          created_at?: string
          id?: string
          images?: string[] | null
          message?: string | null
          order_id?: string
          status?: string
          weaver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_updates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_updates_weaver_id_fkey"
            columns: ["weaver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sarees: {
        Row: {
          color: string
          cost_price: number | null
          created_at: string
          description: string | null
          design: string
          id: string
          images: string[] | null
          is_available: boolean | null
          material: Database["public"]["Enums"]["saree_material"]
          price: number
          title: string
          updated_at: string
          variety: Database["public"]["Enums"]["saree_variety"]
          weaver_id: string
        }
        Insert: {
          color: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          design: string
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          material: Database["public"]["Enums"]["saree_material"]
          price: number
          title: string
          updated_at?: string
          variety: Database["public"]["Enums"]["saree_variety"]
          weaver_id: string
        }
        Update: {
          color?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          design?: string
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          material?: Database["public"]["Enums"]["saree_material"]
          price?: number
          title?: string
          updated_at?: string
          variety?: Database["public"]["Enums"]["saree_variety"]
          weaver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sarees_weaver_id_fkey"
            columns: ["weaver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_applications: {
        Row: {
          application_data: Json | null
          created_at: string
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          scheme_id: string
          status: Database["public"]["Enums"]["scheme_status"] | null
          submitted_at: string | null
          weaver_id: string
        }
        Insert: {
          application_data?: Json | null
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheme_id: string
          status?: Database["public"]["Enums"]["scheme_status"] | null
          submitted_at?: string | null
          weaver_id: string
        }
        Update: {
          application_data?: Json | null
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheme_id?: string
          status?: Database["public"]["Enums"]["scheme_status"] | null
          submitted_at?: string | null
          weaver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_applications_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "government_schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_applications_weaver_id_fkey"
            columns: ["weaver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weaver_metrics: {
        Row: {
          created_at: string
          id: string
          month: number
          orders_fulfilled: number | null
          sarees_completed: number | null
          total_earnings: number | null
          weaver_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          orders_fulfilled?: number | null
          sarees_completed?: number | null
          total_earnings?: number | null
          weaver_id: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          orders_fulfilled?: number | null
          sarees_completed?: number | null
          total_earnings?: number | null
          weaver_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "weaver_metrics_weaver_id_fkey"
            columns: ["weaver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "shipped"
        | "delivered"
        | "cancelled"
      saree_material:
        | "pure_silk"
        | "cotton"
        | "silk_cotton"
        | "synthetic"
        | "linen"
        | "other"
      saree_variety:
        | "silk"
        | "cotton"
        | "handloom"
        | "banarasi"
        | "kanjivaram"
        | "other"
      scheme_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
      user_role:
        | "handloom_head"
        | "district_head"
        | "department_employee"
        | "society_admin"
        | "weaver"
        | "buyer"
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
      order_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      saree_material: [
        "pure_silk",
        "cotton",
        "silk_cotton",
        "synthetic",
        "linen",
        "other",
      ],
      saree_variety: [
        "silk",
        "cotton",
        "handloom",
        "banarasi",
        "kanjivaram",
        "other",
      ],
      scheme_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
      ],
      user_role: [
        "handloom_head",
        "district_head",
        "department_employee",
        "society_admin",
        "weaver",
        "buyer",
      ],
    },
  },
} as const
