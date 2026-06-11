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
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    apiFetch<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),
  me: () => apiFetch<{ user: any; subscription: any }>("/api/auth/me"),
  getSubscription: () =>
    apiFetch<any>("/api/auth/subscription"),
  updateOnboarding: (data: any) =>
    apiFetch<{ status: string }>("/api/auth/onboarding", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
};

export const incomeApi = {
  list: (skip = 0, limit = 50) =>
    apiFetch<any[]>(`/api/income?skip=${skip}&limit=${limit}`),
  create: (data: any) =>
    apiFetch<any>("/api/income", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ status: string }>(`/api/income/${id}`, { method: "DELETE" }),
};

export const gstApi = {
  summary: () => apiFetch<any>("/api/gst/summary"),
  advanceTax: () => apiFetch<any>("/api/gst/advance-tax"),
};

export const invoiceApi = {
  list: (skip = 0, limit = 50) =>
    apiFetch<any[]>(`/api/invoices?skip=${skip}&limit=${limit}`),
  create: (data: any) =>
    apiFetch<any>("/api/invoices", { method: "POST", body: JSON.stringify(data) }),
  get: (id: string) => apiFetch<any>(`/api/invoices/${id}`),
  downloadPdf: (id: string) => fetch(`${API_URL}/api/invoices/${id}/pdf`, { credentials: "include" }),
};

export const settingsApi = {
  getProfile: () => apiFetch<any>("/api/settings/profile"),
  updateProfile: (data: any) =>
    apiFetch<{ status: string }>("/api/settings/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getFXRates: () => apiFetch<any>("/api/settings/fx-rates"),
  setFXRate: (currency: string, rate: number) =>
    apiFetch<any>("/api/settings/fx-rates", {
      method: "PUT",
      body: JSON.stringify({ currency_code: currency, rate_to_inr: rate }),
    }),
  getAPIKeys: () => apiFetch<any[]>("/api/settings/api-keys"),
  setAPIKey: (keyName: string, apiKey: string) =>
    apiFetch<{ status: string }>(`/api/settings/api-keys/${keyName}`, {
      method: "PUT",
      body: JSON.stringify({ api_key: apiKey }),
    }),
  deleteAPIKey: (keyName: string) =>
    apiFetch<{ status: string }>(`/api/settings/api-keys/${keyName}`, { method: "DELETE" }),
};

export const copilotApi = {
  chat: (message: string) =>
    apiFetch<{ response: string }>("/api/copilot/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  exportCSV: () => apiFetch<{ csv_data: string; filename: string }>("/api/copilot/export-csv"),
  gstFilingSummary: () =>
    apiFetch<{ report_data: string; filename: string }>("/api/copilot/gst-filing-summary"),
};

export const paddleApi = {
  verifyTransaction: (transactionId: string) =>
    apiFetch<{ status: string; tier: string }>("/api/paddle/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};