export const NOTIFICATION_CONFIG = {
  POLLING_INTERVAL: 30000, // 30 seconds
  MAX_NOTIFICATIONS_DISPLAY: 50,
} as const;

export const NOTIFICATION_MESSAGES = {
  LOADING: "Memuat notifikasi...",
  EMPTY: "Tidak ada notifikasi",
  MARK_READ: "Tandai sudah dibaca",
  MARK_ALL_READ: "Tandai Semua",
  VIEW_ALL: "Lihat Semua Notifikasi",
  ERROR_FETCH: "Gagal memuat notifikasi",
  ERROR_MARK_READ: "Gagal menandai notifikasi",
} as const;
