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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      address_types: {
        Row: {
          applicable_to: string
          code: string
          display_name: string
          id: number
        }
        Insert: {
          applicable_to: string
          code: string
          display_name: string
          id?: number
        }
        Update: {
          applicable_to?: string
          code?: string
          display_name?: string
          id?: number
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address_type_id: number
          barangay: string
          city: string
          coordinates: Json
          created_at: string
          id: number
          is_default: boolean
          owner_id: string
          owner_type: Database["public"]["Enums"]["owner_type_enum"]
          postal_code: string | null
          province: string
          street_address: string
          updated_at: string
        }
        Insert: {
          address_type_id: number
          barangay: string
          city: string
          coordinates: Json
          created_at?: string
          id?: number
          is_default?: boolean
          owner_id: string
          owner_type: Database["public"]["Enums"]["owner_type_enum"]
          postal_code?: string | null
          province: string
          street_address: string
          updated_at?: string
        }
        Update: {
          address_type_id?: number
          barangay?: string
          city?: string
          coordinates?: Json
          created_at?: string
          id?: number
          is_default?: boolean
          owner_id?: string
          owner_type?: Database["public"]["Enums"]["owner_type_enum"]
          postal_code?: string | null
          province?: string
          street_address?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_address_type_id_fkey"
            columns: ["address_type_id"]
            isOneToOne: false
            referencedRelation: "address_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cart_items: {
        Row: {
          added_at: string
          cart_id: number
          id: number
          product_id: number
          quantity: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          added_at?: string
          cart_id: number
          id?: number
          product_id: number
          quantity?: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          added_at?: string
          cart_id?: number
          id?: number
          product_id?: number
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: number
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      markets: {
        Row: {
          coordinates: Json
          created_at: string
          id: number
          image_path: string | null
          name: string
          status: Database["public"]["Enums"]["market_status_enum"]
          updated_at: string
        }
        Insert: {
          coordinates: Json
          created_at?: string
          id?: number
          image_path?: string | null
          name: string
          status: Database["public"]["Enums"]["market_status_enum"]
          updated_at?: string
        }
        Update: {
          coordinates?: Json
          created_at?: string
          id?: number
          image_path?: string | null
          name?: string
          status?: Database["public"]["Enums"]["market_status_enum"]
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          product_id: number
          product_name: string
          quantity: number
          unit_price: number
          vendor_order_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          product_name: string
          quantity?: number
          unit_price: number
          vendor_order_id: number
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          product_name?: string
          quantity?: number
          unit_price?: number
          vendor_order_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_order_id_fkey"
            columns: ["vendor_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method_enum"]
          payment_status: Database["public"]["Enums"]["payment_status_enum"]
          shipping_address_id: number
          status: Database["public"]["Enums"]["orders_status_enum"]
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method_enum"]
          payment_status: Database["public"]["Enums"]["payment_status_enum"]
          shipping_address_id: number
          status: Database["public"]["Enums"]["orders_status_enum"]
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method_enum"]
          payment_status?: Database["public"]["Enums"]["payment_status_enum"]
          shipping_address_id?: number
          status?: Database["public"]["Enums"]["orders_status_enum"]
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      phone_otps: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          otp_hash: string
          phone: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          otp_hash: string
          phone: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          otp_hash?: string
          phone?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          id: number
          image_path: string | null
          name: string
          price: number
          status: string
          stock: number
          unit: string
          vendor_id: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: number
          image_path?: string | null
          name: string
          price: number
          status?: string
          stock: number
          unit: string
          vendor_id: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
          image_path?: string | null
          name?: string
          price?: number
          status?: string
          stock?: number
          unit?: string
          vendor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role_id: number
          user_id: number
        }
        Insert: {
          role_id: number
          user_id: number
        }
        Update: {
          role_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          delivery_address: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          phone: string
          status: Database["public"]["Enums"]["status_enum"]
          user_id: string
        }
        Insert: {
          delivery_address?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone: string
          status?: Database["public"]["Enums"]["status_enum"]
          user_id?: string
        }
        Update: {
          delivery_address?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["status_enum"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          created_at: string
          description: string | null
          id: number
          market_id: number
          rejected_reason: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          market_id: number
          rejected_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          market_id?: number
          rejected_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_applications_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vendor_orders: {
        Row: {
          created_at: string
          id: number
          order_id: number
          status: Database["public"]["Enums"]["vendor_orders_status_enum"]
          subtotal: number
          vendor_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          status: Database["public"]["Enums"]["vendor_orders_status_enum"]
          subtotal: number
          vendor_id: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          status?: Database["public"]["Enums"]["vendor_orders_status_enum"]
          subtotal?: number
          vendor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendor_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          approved_at: string | null
          created_at: string
          description: string | null
          id: number
          market_id: number
          updated_at: string
          user_id: string
          vendor_status: Database["public"]["Enums"]["vendor_status_enum"]
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          description?: string | null
          id?: number
          market_id: number
          updated_at?: string
          user_id: string
          vendor_status?: Database["public"]["Enums"]["vendor_status_enum"]
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          description?: string | null
          id?: number
          market_id?: number
          updated_at?: string
          user_id?: string
          vendor_status?: Database["public"]["Enums"]["vendor_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "vendors_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: { Args: { order_id: string }; Returns: undefined }
    }
    Enums: {
      application_status_enum: "submitted" | "approved" | "rejected"
      market_status_enum: "open" | "closed"
      orders_status_enum: "pending_payment" | "paid" | "cancelled" | "completed"
      owner_type_enum: "user" | "vendor"
      payment_method_enum: "cash_on_delivery" | "e_payment"
      payment_status_enum: "pending" | "paid" | "failed" | "refunded"
      status_enum: "active" | "suspended" | "deleted"
      vendor_orders_status_enum:
        | "pending"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
      vendor_status_enum: "pending" | "approved" | "rejected" | "suspended"
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
      application_status_enum: ["submitted", "approved", "rejected"],
      market_status_enum: ["open", "closed"],
      orders_status_enum: ["pending_payment", "paid", "cancelled", "completed"],
      owner_type_enum: ["user", "vendor"],
      payment_method_enum: ["cash_on_delivery", "e_payment"],
      payment_status_enum: ["pending", "paid", "failed", "refunded"],
      status_enum: ["active", "suspended", "deleted"],
      vendor_orders_status_enum: [
        "pending",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      vendor_status_enum: ["pending", "approved", "rejected", "suspended"],
    },
  },
} as const
