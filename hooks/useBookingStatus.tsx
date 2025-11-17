import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export function useBookingStatus() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "VALIDATED":
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "Menunggu validasi dari Admin";
      case "VALIDATED":
        return "Sudah divalidasi Admin, menunggu persetujuan Wadir";
      case "APPROVED":
        return "Peminjaman telah disetujui! Memo tersedia untuk diunduh";
      case "REJECTED":
        return "Peminjaman ditolak oleh Admin";
      default:
        return "Status tidak diketahui";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "VALIDATED":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "APPROVED":
        return "bg-green-50 border-green-200 text-green-900";
      case "REJECTED":
        return "bg-red-50 border-red-200 text-red-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  return {
    getStatusIcon,
    getStatusMessage,
    getStatusColor,
  };
}
