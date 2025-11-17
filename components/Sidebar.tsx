"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  LogOut,
  Building2,
  CheckSquare,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: "STUDENT" | "ADMIN" | "WADIR3";
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        href: `/dashboard/${role.toLowerCase() === "student" ? "mahasiswa" : role.toLowerCase() === "admin" ? "admin" : "wadir"}`,
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    ];

    if (role === "STUDENT") {
      return [
        ...baseItems,
        {
          href: "/dashboard/mahasiswa/booking",
          label: "Ajukan Peminjaman",
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          href: "/dashboard/mahasiswa/tracking",
          label: "Tracking Peminjaman",
          icon: <TrendingUp className="w-5 h-5" />,
        },
        {
          href: "/dashboard/mahasiswa/riwayat",
          label: "Riwayat",
          icon: <FileText className="w-5 h-5" />,
        },
      ];
    }

    if (role === "ADMIN") {
      return [
        ...baseItems,
        {
          href: "/dashboard/admin/validasi",
          label: "Validasi Peminjaman",
          icon: <CheckSquare className="w-5 h-5" />,
        },
        {
          href: "/dashboard/admin/ruangan",
          label: "Kelola Ruangan",
          icon: <Building2 className="w-5 h-5" />,
        },
        {
          href: "/dashboard/admin/riwayat",
          label: "Riwayat",
          icon: <FileText className="w-5 h-5" />,
        },
      ];
    }

    // WADIR3
    return [
      ...baseItems,
      {
        href: "/dashboard/wadir/approval",
        label: "Approval Peminjaman",
        icon: <CheckSquare className="w-5 h-5" />,
      },
      {
        href: "/dashboard/wadir/riwayat",
        label: "Riwayat",
        icon: <FileText className="w-5 h-5" />,
      },
    ];
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    if (role === "STUDENT") return "Mahasiswa";
    if (role === "ADMIN") return "Admin";
    return "Wadir III";
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Peminjaman</h2>
            <p className="text-xs text-slate-400">Ruangan Kampus</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Login sebagai</p>
          <p className="font-medium text-sm truncate">{userName}</p>
          <p className="text-xs text-blue-400 mt-1">{getRoleLabel()}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-white">Peminjaman Ruangan</h2>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-slate-900 text-white border-slate-700">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <div className="flex flex-col h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full bg-slate-900 text-white w-64">
        <SidebarContent />
      </div>
    </>
  );
}
