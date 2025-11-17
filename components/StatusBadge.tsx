import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Status with clear background and text colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "VALIDATED":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Menunggu Validasi";
      case "VALIDATED":
        return "Validasi Admin";
      case "APPROVED":
        return "Disetujui";
      case "REJECTED":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusStyle(status)} font-semibold`}>{getStatusText(status)}</Badge>
  );
}
