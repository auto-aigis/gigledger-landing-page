export interface User {
  id: string;
  email: string;
  display_name: string | null;
  business_type: string;
  gst_status: string;
  gstin: string | null;
  primary_currency: string;
  onboarding_complete: boolean;
  created_at: string;
}

export interface Subscription {
  tier: string;
  status: string;
  current_period_end: string | null;
}

export interface IncomeEntry {
  id: string;
  platform_source: string;
  amount: number;
  currency: string;
  amount_inr: number;
  fx_rate_used: number;
  entry_date: string;
  client_name: string | null;
  description: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_address: string | null;
  client_gstin: string | null;
  line_items: Array<{ description: string; quantity: number; rate: number }>;
  gst_rate: number;
  hsn_sac_code: string | null;
  place_of_supply: string | null;
  taxable_amount: number;
  gst_amount: number;
  total_amount: number;
  invoice_date: string;
  due_date: string;
  status: string;
  created_at: string;
}

export interface GSTSummary {
  total_income_inr: number;
  estimated_gst_18_percent: number;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  registration_threshold: number;
  is_approaching_threshold: boolean;
  threshold_percentage: number;
  disclaimer: string;
}

export interface AdvanceTax {
  due_dates: Array<{ due_date: string; estimated_amount: number }>;
}

export interface FXRates {
  [key: string]: number;
}

export interface APIKey {
  key_name: string;
  masked_key: string;
}

export interface AuthContext {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}