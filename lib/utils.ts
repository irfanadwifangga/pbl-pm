import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "VALIDATED":
      return "bg-blue-500";
    case "APPROVED":
      return "bg-green-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function getStatusText(status: string): string {
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
}
