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
      attributes: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          price: number
          quantity: number
          variant_id: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          price: number
          quantity?: number
          variant_id: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          price?: number
          quantity?: number
          variant_id?: string
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
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          banner_image: string | null
          created_at: string
          icon: string | null
          id: string
          level: number
          name: string
          parent_id: string | null
          slug: string
          status: string
        }
        Insert: {
          banner_image?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level?: number
          name: string
          parent_id?: string | null
          slug: string
          status?: string
        }
        Update: {
          banner_image?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level?: number
          name?: string
          parent_id?: string | null
          slug?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          available_stock: number
          damaged_stock: number
          id: string
          reserved_stock: number
          updated_at: string
          variant_id: string
          warehouse_id: string
        }
        Insert: {
          available_stock?: number
          damaged_stock?: number
          id?: string
          reserved_stock?: number
          updated_at?: string
          variant_id: string
          warehouse_id: string
        }
        Update: {
          available_stock?: number
          damaged_stock?: number
          id?: string
          reserved_stock?: number
          updated_at?: string
          variant_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_name: string
          quantity: number
          shipment_id: string | null
          status: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_name: string
          quantity?: number
          shipment_id?: string | null
          status?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_name?: string
          quantity?: number
          shipment_id?: string | null
          status?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_shipment"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          order_number: string
          payment_status: string
          shipping_address_id: string | null
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number: string
          payment_status?: string
          shipping_address_id?: string | null
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: string
          payment_status?: string
          shipping_address_id?: string | null
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          payment_gateway: string | null
          payment_method: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          payment_gateway?: string | null
          payment_method: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          payment_gateway?: string | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_thumbnail: boolean
          position: number
          product_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_thumbnail?: boolean
          position?: number
          product_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_thumbnail?: boolean
          position?: number
          product_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          created_at: string
          discount_price: number | null
          id: string
          is_default: boolean
          price: number
          product_id: string
          sku: string
          status: string
        }
        Insert: {
          barcode?: string | null
          created_at?: string
          discount_price?: number | null
          id?: string
          is_default?: boolean
          price: number
          product_id: string
          sku: string
          status?: string
        }
        Update: {
          barcode?: string | null
          created_at?: string
          discount_price?: number | null
          id?: string
          is_default?: boolean
          price?: number
          product_id?: string
          sku?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          courier_name: string | null
          created_at: string
          estimated_delivery: string | null
          id: string
          order_id: string
          shipped_at: string | null
          status: string
          tracking_number: string | null
        }
        Insert: {
          courier_name?: string | null
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          order_id: string
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
        }
        Update: {
          courier_name?: string | null
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          phone: string | null
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          phone?: string | null
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          phone?: string | null
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          phone: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          phone?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      variant_attribute_values: {
        Row: {
          attribute_id: string
          id: string
          value: string
          variant_id: string
        }
        Insert: {
          attribute_id: string
          id?: string
          value: string
          variant_id: string
        }
        Update: {
          attribute_id?: string
          id?: string
          value?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_attribute_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          name: string
          pincode: string
          state: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          name: string
          pincode: string
          state: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          name?: string
          pincode?: string
          state?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
