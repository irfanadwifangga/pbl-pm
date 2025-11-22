import { useState } from "react";
import toast from "react-hot-toast";

interface UseDownloadMemoReturn {
  isDownloading: boolean;
  downloadMemo: (bookingId: string) => Promise<void>;
}

export function useDownloadMemo(): UseDownloadMemoReturn {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadMemo = async (bookingId: string) => {
    try {
      setIsDownloading(true);

      // Fetch PDF from API
      const response = await fetch(`/api/memo/${bookingId}/download`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download memo");
      }

      // Get PDF blob
      const blob = await response.blob();

      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "Memo_Peminjaman.pdf";

      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Memo berhasil diunduh!");
    } catch (error: any) {
      console.error("Error downloading memo:", error);
      toast.error(error.message || "Gagal mengunduh memo");
      throw error; // Re-throw for component to handle if needed
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    downloadMemo,
  };
}
