'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function useQRScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.scanQR(text);
      if (data.message === 'Member not found or invalid QR') {
        setError(data.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to process QR scan');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { scan, result, error, loading, reset };
}
