export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: "admin" | "manager" | "operator" | "accountant"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role: "admin" | "manager" | "operator" | "accountant"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: "admin" | "manager" | "operator" | "accountant"
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          user_id: string | null
          employee_code: string
          name: string
          designation: string
          department: string
          date_of_joining: string
          phone: string | null
          address: string | null
          salary_per_day: number | null
          ot_rate_per_hour: number | null
          status: "active" | "inactive"
          created_at: string
          updated_at: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          customer_code: string
          company_name: string
          contact_person: string | null
          phone: string | null
          email: string | null
          gst_number: string | null
          billing_address: string | null
          shipping_address: string | null
          credit_limit: number | null
          status: "active" | "inactive"
          created_at: string
          updated_at: string
        }
      }
      job_cards: {
        Row: {
          id: string
          user_id: string | null
          job_card_number: string
          customer_id: string | null
          part_id: string | null
          quantity: number
          start_date: string
          target_date: string
          completion_date: string | null
          status: "pending" | "in_progress" | "completed" | "cancelled"
          priority: "low" | "normal" | "high" | "urgent"
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string | null
          invoice_number: string
          customer_id: string | null
          dc_id: string | null
          invoice_date: string
          due_date: string
          subtotal: number
          tax_percentage: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          amount_paid: number
          balance: number
          payment_status: "unpaid" | "partially_paid" | "paid" | "overdue"
          payment_terms: string | null
          notes: string | null
          created_at: string
          updated_at: string
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
