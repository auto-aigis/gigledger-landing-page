export interface User {
  id: string;
  email: string;
  display_name: string | null;
  pan_number: string | null;
  gst_status: string;
  gstin: string | null;
  primary_currency: string;
  address: string | null;
  tier: string;
  onboarding_complete: boolean;
  created_at: string;
}

export interface IncomeEntry {
  id: string;
  platform: string;
  amount_original: number;
  original_currency: string;
  amount_inr: number;
  date: string;
  client_name: string | null;
  description: string | null;
  service_type: string;
  created_at: string;
}

export interface IncomeSummary {
  total_month: number;
  total_quarter: number;
  total_ytd: number;
  by_source: Record<string, number>;
}

export interface GSTEstimate {
  estimated_gst_payable: number;
  cgst: number;
  sgst: number;
  igst: number;
  domestic_income: number;
  export_income: number;
  threshold_progress_percent: number;
  is_approaching_threshold: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_address: string;
  client_gstin: string | null;
  service_description: string;
  hsc_sac_code: string | null;
  amount: number;
  gst_rate: number;
  tax_type: string;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  invoice_date: string;
  created_at: string;
}

export interface Subscription {
  status: string;
  tier: string | null;
  current_period_end: string | null;
}
