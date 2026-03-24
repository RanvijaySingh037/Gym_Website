const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Members
  getMembers: async () => {
    const res = await fetch(`${API_BASE_URL}/members`);
    return res.json();
  },
  createMember: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateMember: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  resetDevice: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}/reset-device`, {
      method: 'PUT',
    });
    return res.json();
  },
  deleteMember: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
  processPayment: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/members/${id}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Attendance
  scanQR: async (qrCodeString: string) => {
    const res = await fetch(`${API_BASE_URL}/attendance/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrCodeString }),
    });
    return res.json();
  },

  // Expenses
  getExpenses: async () => {
    const res = await fetch(`${API_BASE_URL}/expenses`);
    return res.json();
  },
  createExpense: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    return res.json();
  },
};
