const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Members
  getMembers: async () => {
    const res = await fetch(`${API_BASE_URL}/members`, { headers: getHeaders() });
    return res.json();
  },
  createMember: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateMember: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  resetDevice: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}/reset-device`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return res.json();
  },
  deleteMember: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
  processPayment: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}/payment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Attendance
  scanQR: async (qrCodeString: string) => {
    const res = await fetch(`${API_BASE_URL}/attendance/scan`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ qrCodeString }),
    });
    return { data: await res.json(), ok: res.ok };
  },
  getAttendanceToday: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/today`, { headers: getHeaders() });
    return res.json();
  },
  getAttendanceHistory: async (date: string) => {
    const res = await fetch(`${API_BASE_URL}/attendance/history?date=${date}`, { headers: getHeaders() });
    return res.json();
  },
  getRetentionStats: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/retention`, { headers: getHeaders() });
    return res.json();
  },
  getCheckinQR: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/attendance/checkin-qr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Expenses
  getExpenses: async () => {
    const res = await fetch(`${API_BASE_URL}/expenses`, { headers: getHeaders() });
    return res.json();
  },
  createExpense: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Inventory
  getInventory: async () => {
    const res = await fetch(`${API_BASE_URL}/inventory`, { headers: getHeaders() });
    return res.json();
  },
  createInventoryItem: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  sellInventoryItem: async (id: string, quantity: number) => {
    const res = await fetch(`${API_BASE_URL}/inventory/${id}/sell`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/settings`, { headers: getHeaders() });
    return res.json();
  },

  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard`, { headers: getHeaders() });
    return res.json();
  },

  // Member Portal
  memberLogin: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/member-portal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { data: await res.json(), ok: res.ok };
  },
  getMemberProfile: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/member-portal/${id}`, { headers: getHeaders() });
    return res.json();
  },
  updateMemberProgress: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/member-portal/${id}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
