import { Skeleton } from "@/components/ui/skeleton";

export function NotificationBellSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="w-10 h-10 rounded-md" />
    </div>
  );
}
