"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email atau password salah!");
        setLoading(false);
        return;
      }

      toast.success("Login berhasil!");
      
      // Fetch session to get user role
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      
      // Redirect based on role
      if (session?.user?.role === "STUDENT") {
        router.push("/dashboard/mahasiswa");
      } else if (session?.user?.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (session?.user?.role === "WADIR3") {
        router.push("/dashboard/wadir");
      } else {
        router.push("/dashboard");
      }
      
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sistem Peminjaman Ruangan
          </CardTitle>
          <CardDescription className="text-center">Masuk untuk mengakses dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Akun:</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Mahasiswa: mahasiswa@kampus.ac.id</p>
              <p>• Admin: admin@kampus.ac.id</p>
              <p>• Wadir III: wadir3@kampus.ac.id</p>
              <p className="mt-1 text-xs">
                Password semua: <span className="font-mono">password123</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
