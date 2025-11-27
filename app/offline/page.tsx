"use client";

import { WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-6 rounded-full">
            <WifiOff className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Tidak Ada Koneksi Internet</h1>
          <p className="text-gray-600 text-lg">
            Sepertinya Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button onClick={() => window.location.reload()} className="w-full" size="lg">
            Coba Lagi
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full" size="lg">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <div className="pt-6 text-sm text-gray-500">
          <p>Tips: Pastikan koneksi internet Anda aktif dan coba refresh halaman.</p>
        </div>
      </div>
    </div>
  );
}
