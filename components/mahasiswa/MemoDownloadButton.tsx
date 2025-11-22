"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useDownloadMemo } from "@/hooks/useDownloadMemo";

interface MemoDownloadButtonProps {
  bookingId: string;
}

export function MemoDownloadButton({ bookingId }: MemoDownloadButtonProps) {
  const { isDownloading, downloadMemo } = useDownloadMemo();

  const handleDownloadMemo = () => {
    downloadMemo(bookingId);
  };

  return (
    <Button size="sm" className="w-full" onClick={handleDownloadMemo} disabled={isDownloading}>
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Membuat memo...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Unduh Memo Peminjaman
        </>
      )}
    </Button>
  );
}
