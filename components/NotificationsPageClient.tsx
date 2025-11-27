"use client";

import {
  useNotifications,
  type Notification,
  type NotificationType,
} from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { NOTIFICATION_MESSAGES } from "@/lib/constants/notification";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  FileText,
  CheckCircle,
  CheckCircle2,
  XCircle,
  FileCheck,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getNotificationIcon = (type: NotificationType): LucideIcon => {
  const iconMap: Record<NotificationType, LucideIcon> = {
    NEW_BOOKING: FileText,
    BOOKING_VALIDATED: CheckCircle,
    BOOKING_APPROVED: CheckCircle2,
    BOOKING_REJECTED: XCircle,
    MEMO_READY: FileCheck,
  };
  return iconMap[type];
};

const getNotificationTypeLabel = (type: NotificationType): string => {
  const labels: Record<NotificationType, string> = {
    NEW_BOOKING: "Peminjaman Baru",
    BOOKING_VALIDATED: "Validasi",
    BOOKING_APPROVED: "Disetujui",
    BOOKING_REJECTED: "Ditolak",
    MEMO_READY: "Memo Siap",
  };
  return labels[type];
};

const getNotificationTypeBadgeVariant = (
  type: NotificationType
): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<NotificationType, "default" | "secondary" | "destructive" | "outline"> = {
    NEW_BOOKING: "default",
    BOOKING_VALIDATED: "secondary",
    BOOKING_APPROVED: "default",
    BOOKING_REJECTED: "destructive",
    MEMO_READY: "outline",
  };
  return variants[type];
};

export function NotificationsPageClient() {
  const router = useRouter();
  const { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead } =
    useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Gagal memuat notifikasi</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter and Actions Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Semua
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Belum Dibaca
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
      </Card>

      {/* Notifications List */}
      {isLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>{NOTIFICATION_MESSAGES.LOADING}</p>
          </div>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {filter === "unread"
                ? "Tidak ada notifikasi yang belum dibaca"
                : NOTIFICATION_MESSAGES.EMPTY}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`p-5 transition-all hover:shadow-md cursor-pointer ${
                  !notification.isRead ? "bg-accent/50 border-primary/20" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold ${
                              !notification.isRead ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                        <Badge
                          variant={getNotificationTypeBadgeVariant(notification.type)}
                          className="text-xs"
                        >
                          {getNotificationTypeLabel(notification.type)}
                        </Badge>
                      </div>

                      {/* Mark as Read Button */}
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="flex-shrink-0"
                          title={NOTIFICATION_MESSAGES.MARK_READ}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: localeId,
                        })}
                      </span>

                      {notification.link && (
                        <span className="text-primary text-xs font-medium">Lihat Detail →</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Load More (Future Enhancement) */}
      {filteredNotifications.length >= 50 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredNotifications.length} notifikasi terbaru
          </p>
        </div>
      )}
    </div>
  );
}
