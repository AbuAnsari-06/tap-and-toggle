export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ServiceType = "plumbing" | "electrical";

export type JobStatus =
  | "New"
  | "Contacted"
  | "Estimated"
  | "Approved"
  | "Scheduled"
  | "Assigned"
  | "On the way"
  | "Arrived"
  | "In Progress"
  | "Done"
  | "Paid"
  | "Warranty"
  | "Closed"
  | "Rescheduled"
  | "Cancelled"
  | "No-show"
  | "Partial";

export type PaymentMethod = "UPI" | "Cash" | "Razorpay" | "Card" | "NetBanking";
export type PaymentStatus = "pending" | "captured" | "completed" | "failed" | "refunded";

export interface Society {
  id: string;
  name: string;
  area: string;
  contact?: string | null;
  has_mou: boolean;
  corpus_share_pct?: number | null;
  pre_approved: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  flat_no?: string | null;
  society_id?: string | null;
  whatsapp_opt_in: boolean;
  created_at: string;
}

export interface Pro {
  id: string;
  name: string;
  phone: string;
  service: ServiceType;
  photo?: string | null;
  active: boolean;
  base_rate: number;
  vetting_docs_ref?: string | null;
  gate_list_status?: string | null;
  health_score?: number | null;
  personal_accident_doc?: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  service: ServiceType;
  description: string;
  status: JobStatus;
  requested_slot?: string | null;
  pro_id?: string | null;
  is_emergency: boolean;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  estimate_amount?: number | null;
  final_amount?: number | null;
  parts_amount?: number | null;
  handling_fee?: number | null;
  created_at: string;
}

export interface Payment {
  id: string;
  job_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  upi_ref_no?: string | null;
  invoice_no?: string | null;
  notes?: string | null;
  settled_to_pro_amount?: number | null;
  settled_at?: string | null;
  created_at: string;
}

export interface ConsentRecord {
  id: string;
  customer_id: string;
  purpose: string;
  text_version: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      society: {
        Row: Society;
        Insert: {
          id?: string;
          name: string;
          area?: string;
          contact?: string | null;
          has_mou?: boolean;
          corpus_share_pct?: number | null;
          pre_approved?: boolean;
          created_at?: string;
        };
        Update: Partial<Society>;
        Relationships: [];
      };
      customer: {
        Row: Customer;
        Insert: {
          id?: string;
          phone: string;
          name: string;
          flat_no?: string | null;
          society_id?: string | null;
          whatsapp_opt_in?: boolean;
          created_at?: string;
        };
        Update: Partial<Customer>;
        Relationships: [
          {
            foreignKeyName: "customer_society_id_fkey";
            columns: ["society_id"];
            isOneToOne: false;
            referencedRelation: "society";
            referencedColumns: ["id"];
          }
        ];
      };
      pro: {
        Row: Pro;
        Insert: {
          id?: string;
          name: string;
          phone: string;
          service: ServiceType;
          photo?: string | null;
          active?: boolean;
          base_rate?: number;
          vetting_docs_ref?: string | null;
          gate_list_status?: string | null;
          health_score?: number | null;
          personal_accident_doc?: string | null;
          created_at?: string;
        };
        Update: Partial<Pro>;
        Relationships: [];
      };
      job: {
        Row: Job;
        Insert: {
          id?: string;
          customer_id: string;
          service: ServiceType;
          description: string;
          status?: JobStatus;
          requested_slot?: string | null;
          pro_id?: string | null;
          is_emergency?: boolean;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          estimate_amount?: number | null;
          final_amount?: number | null;
          parts_amount?: number | null;
          handling_fee?: number | null;
          created_at?: string;
        };
        Update: Partial<Job>;
        Relationships: [
          {
            foreignKeyName: "job_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customer";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_pro_id_fkey";
            columns: ["pro_id"];
            isOneToOne: false;
            referencedRelation: "pro";
            referencedColumns: ["id"];
          }
        ];
      };
      payment: {
        Row: Payment;
        Insert: {
          id?: string;
          job_id: string;
          amount: number;
          method: PaymentMethod;
          status?: PaymentStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          upi_ref_no?: string | null;
          invoice_no?: string | null;
          notes?: string | null;
          settled_to_pro_amount?: number | null;
          settled_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Payment>;
        Relationships: [
          {
            foreignKeyName: "payment_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "job";
            referencedColumns: ["id"];
          }
        ];
      };
      consent_record: {
        Row: ConsentRecord;
        Insert: {
          id?: string;
          customer_id: string;
          purpose?: string;
          text_version: string;
          created_at?: string;
        };
        Update: Partial<ConsentRecord>;
        Relationships: [
          {
            foreignKeyName: "consent_record_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customer";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
