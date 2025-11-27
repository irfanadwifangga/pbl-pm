import { Suspense } from "react";
import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load NotificationsPageClient
const NotificationsPageClient = dynamic(
  () =>
    import("@/components/NotificationsPageClient").then((mod) => ({
      default: mod.NotificationsPageClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export const metadata = {
  title: "Notifikasi | Dashboard",
  description: "Lihat semua notifikasi Anda",
};

export default async function NotificationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifikasi</h1>
        <p className="text-muted-foreground mt-2">
          Semua notifikasi dan aktivitas terkait peminjaman ruangan
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <NotificationsPageClient />
      </Suspense>
    </div>
  );
}
