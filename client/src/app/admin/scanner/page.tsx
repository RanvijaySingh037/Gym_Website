'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Camera, Loader2 } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

import { api } from '@/lib/api';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = async (result: any) => {
    if (result && result[0]?.rawValue && !loading && isScanning) {
      const qrCodeString = result[0].rawValue;
      setLoading(true);
      setIsScanning(false);
      
      try {
        const { data, ok } = await api.scanQR(qrCodeString);
        
        if (ok) {
          setScanResult({ success: true, message: data.message, member: data.member });
          setError('');
        } else {
          setScanResult({ success: false, message: data.message, member: data.member });
          setError('');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to scan');
        setScanResult(null);
      } finally {
        setLoading(false);
        // Auto reset after 5 seconds
        setTimeout(() => {
          setScanResult(null);
          setIsScanning(true);
        }, 5000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">QR Scanner</h1>
        <p className="text-zinc-500">Scan member QR codes to mark attendance instantly.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden">
        {scanResult ? (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-300">
            {scanResult.success ? (
              <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
            ) : (
              <XCircle className="w-24 h-24 text-rose-500 mb-6" />
            )}
            <h2 className={`text-2xl font-bold mb-2 ${scanResult.success ? 'text-emerald-500' : 'text-rose-500'}`}>
              {scanResult.message}
            </h2>
            {scanResult.member && (
              <div className="mt-4 flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl w-full max-w-sm">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-2xl">
                  {scanResult.member.photo ? (
                    <img src={scanResult.member.photo} alt="Member" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    scanResult.member.name.charAt(0)
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{scanResult.member.name}</p>
                </div>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-16 h-16 text-rose-600 animate-spin" />
            <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest">Processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {!isScanning ? (
              <button 
                onClick={() => setIsScanning(true)}
                className="w-48 h-48 rounded-full bg-zinc-900 hover:bg-zinc-800 border-4 border-dashed border-zinc-700 flex flex-col items-center justify-center transition-all group"
              >
                <Camera className="w-12 h-12 text-zinc-500 group-hover:text-rose-600 transition-colors mb-2" />
                <span className="font-bold text-zinc-400 group-hover:text-white uppercase tracking-wider text-sm">Start Camera</span>
              </button>
            ) : (
              <div className="w-full max-w-md aspect-square bg-black rounded-2xl overflow-hidden border-2 border-rose-600 relative">
                <div className="absolute inset-0 border-[6px] border-rose-600/20 z-10 pointer-events-none"></div>
                
                <Scanner
                  onScan={handleScan}
                  onError={(err: any) => setError(err?.message || 'Camera error')}
                  styles={{
                    container: { width: '100%', height: '100%' },
                    video: { objectFit: 'cover', width: '100%', height: '100%' }
                  }}
                  components={{
                    torch: true,
                  }}
                  allowMultiple={false}
                />

                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            )}
            
            {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}
            
            {isScanning && (
              <button 
                onClick={() => setIsScanning(false)}
                className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Cancel Scanning
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
