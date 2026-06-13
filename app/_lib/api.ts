const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST", body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    apiFetch<any>("/api/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),
  me: () => apiFetch<any>("/api/auth/me"),
  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST", body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST", body: JSON.stringify({ email }),
    }),
  saveOnboarding: (data: {
    display_name: string; pan_number: string | null; gst_status: string;
    gstin: string | null; primary_currency: string; address: string | null;
  }) =>
    apiFetch<{ status: string }>("/api/auth/onboarding", {
      method: "PUT", body: JSON.stringify(data),
    }),
  getSubscription: () => apiFetch<any>("/api/auth/subscription"),
};

export const incomeApi = {
  list: () => apiFetch<any[]>("/api/income/"),
  create: (data: {
    platform: string; amount_original: number; original_currency: string;
    amount_inr: number; date: string; client_name: string | null;
    description: string | null; service_type: string;
  }) => apiFetch<any>("/api/income/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: {
    platform: string; amount_original: number; original_currency: string;
    amount_inr: number; date: string; client_name: string | null;
    description: string | null; service_type: string;
  }) => apiFetch<any>(`/api/income/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ status: string }>(`/api/income/${id}`, { method: "DELETE" }),
  getSummary: () => apiFetch<any>("/api/income/summary"),
  getGSTEstimate: () => apiFetch<any>("/api/income/gst-estimate"),
};

export const invoiceApi = {
  list: () => apiFetch<any[]>("/api/invoices/"),
  create: (data: {
    client_name: string; client_address: string; client_gstin: string | null;
    service_description: string; hsc_sac_code: string | null; amount: number;
    gst_rate: number; tax_type: string; invoice_date: string;
  }) => apiFetch<any>("/api/invoices/", { method: "POST", body: JSON.stringify(data) }),
  download: (invoiceId: string) =>
    fetch(`${API_URL}/api/invoices/${invoiceId}/download`, { credentials: "include" }),
};

export const paddleApi = {
  getCheckoutUrl: (price_id: string) =>
    apiFetch<{ price_id: string; checkout_url: string }>(
      `/api/payments/paddle-checkout?price_id=${encodeURIComponent(price_id)}`,
      { method: "GET" }
    ),
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: string }>("/api/payments/verify-transaction", {
      method: "POST", body: JSON.stringify({ transaction_id }),
    }),
};

export const waitlistApi = {
  join: (email: string) =>
    apiFetch<{ status: string; email: string }>("/waitlist", {
      method: "POST", body: JSON.stringify({ email }),
    }),
};
