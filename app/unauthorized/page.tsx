import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Akses Ditolak</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <Link href="/dashboard">
            <Button className="w-full">Kembali ke Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
