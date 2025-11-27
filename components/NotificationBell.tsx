"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  FileText,
  CheckCircle,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, type NotificationType } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { NOTIFICATION_MESSAGES } from "@/lib/constants/notification";
import type { LucideIcon } from "lucide-react";

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

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = async (notificationId: string, link?: string | null) => {
    await markAsRead(notificationId);
    if (link) {
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative text-slate-800 hover:text-white hover:bg-slate-800"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 bg-slate-800 border-slate-700" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="font-semibold text-white">Notifikasi</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-700"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Tandai Semua
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm">{NOTIFICATION_MESSAGES.LOADING}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{NOTIFICATION_MESSAGES.EMPTY}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-700/50 transition-colors ${
                      !notification.isRead ? "bg-slate-700/30" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.isRead ? "text-white" : "text-slate-300"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title={NOTIFICATION_MESSAGES.MARK_READ}
                              aria-label={NOTIFICATION_MESSAGES.MARK_READ}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: localeId,
                            })}
                          </span>

                          {notification.link && (
                            <Link
                              href={notification.link}
                              onClick={() =>
                                handleNotificationClick(notification.id, notification.link)
                              }
                              className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                            >
                              Lihat →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-700 text-center">
            <Link
              href="/dashboard/notifications"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Lihat Semua Notifikasi
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
