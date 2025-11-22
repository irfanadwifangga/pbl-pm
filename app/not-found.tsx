"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-600/20 rounded-full absolute blur-2xl"></div>
            <FileQuestion className="w-32 h-32 text-blue-500 relative animate-pulse" />
          </div>
        </div>

        <h1 className="text-8xl font-bold text-white mb-4">404</h1>

        <h2 className="text-3xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h2>

        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan atau
          dihapus.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <Button
            onClick={() => history.back()}
            size="lg"
            variant="outline"
            className="border-slate-700 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Halaman Sebelumnya
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm">Butuh bantuan? Hubungi administrator sistem</p>
        </div>
      </div>
    </div>
  );
}
