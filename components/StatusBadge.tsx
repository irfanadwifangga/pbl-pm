import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_STYLES } from "@/lib/constants/common";
import type { BookingStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyle =
    BOOKING_STATUS_STYLES[status] || "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
  const statusText = BOOKING_STATUS_LABELS[status] || status;

  return <Badge className={`${statusStyle} font-semibold`}>{statusText}</Badge>;
}
