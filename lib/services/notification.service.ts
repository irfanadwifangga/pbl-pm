import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async create(data: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Create multiple notifications (bulk)
   */
  static async createMany(notifications: CreateNotificationInput[]) {
    return prisma.notification.createMany({
      data: notifications.map((notif) => ({
        userId: notif.userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: notif.link,
        metadata: notif.metadata,
      })),
    });
  }

  /**
   * Get all notifications for a user
   */
  static async getByUserId(userId: string, limit = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        link: true,
        isRead: true,
        readAt: true,
        createdAt: true,
        // Don't expose metadata and updatedAt to client
      },
    });
  }

  /**
   * Get notification by ID
   */
  static async getById(notificationId: string) {
    return prisma.notification.findUnique({
      where: { id: notificationId },
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        message: true,
        link: true,
        isRead: true,
        readAt: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get unread notifications for a user
   */
  static async getUnreadByUserId(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async deleteOlderThan(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
        isRead: true,
      },
    });
  }

  // === Notification Creators for Booking Events ===

  /**
   * Notify admin when new booking is created
   */
  static async notifyAdminNewBooking(bookingId: string, studentName: string, roomName: string) {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (admins.length === 0) {
      console.warn("No admins found to notify");
      return null;
    }

    const notifications: CreateNotificationInput[] = admins.map((admin) => ({
      userId: admin.id,
      type: "NEW_BOOKING" as NotificationType,
      title: "Peminjaman Baru",
      message: `${studentName} mengajukan peminjaman ruangan ${roomName}`,
      link: `/dashboard/admin/validasi`,
      metadata: { bookingId, studentName, roomName },
    }));

    return this.createMany(notifications);
  }

  /**
   * Notify wadir when booking is validated by admin
   */
  static async notifyWadirBookingValidated(
    bookingId: string,
    studentName: string,
    roomName: string
  ) {
    const wadirs = await prisma.user.findMany({
      where: { role: "WADIR3" },
      select: { id: true },
    });

    if (wadirs.length === 0) {
      console.warn("No wadir found to notify");
      return null;
    }

    const notifications: CreateNotificationInput[] = wadirs.map((wadir) => ({
      userId: wadir.id,
      type: "BOOKING_VALIDATED" as NotificationType,
      title: "Peminjaman Perlu Approval",
      message: `Peminjaman ${roomName} oleh ${studentName} menunggu approval`,
      link: `/dashboard/wadir/approval`,
      metadata: { bookingId, studentName, roomName },
    }));

    return this.createMany(notifications);
  }

  /**
   * Notify student when booking is approved
   */
  static async notifyStudentBookingApproved(userId: string, bookingId: string, roomName: string) {
    return this.create({
      userId,
      type: "BOOKING_APPROVED" as NotificationType,
      title: "Peminjaman Disetujui",
      message: `Peminjaman ruangan ${roomName} telah disetujui. Memo siap diunduh.`,
      link: `/dashboard/mahasiswa/tracking`,
      metadata: { bookingId, roomName },
    });
  }

  /**
   * Notify student when booking is rejected
   */
  static async notifyStudentBookingRejected(
    userId: string,
    bookingId: string,
    roomName: string,
    reason?: string
  ) {
    return this.create({
      userId,
      type: "BOOKING_REJECTED" as NotificationType,
      title: "Peminjaman Ditolak",
      message: reason
        ? `Peminjaman ruangan ${roomName} ditolak. Alasan: ${reason}`
        : `Peminjaman ruangan ${roomName} ditolak`,
      link: `/dashboard/mahasiswa/tracking`,
      metadata: { bookingId, roomName, reason },
    });
  }

  /**
   * Notify student when memo is ready
   */
  static async notifyStudentMemoReady(
    userId: string,
    bookingId: string,
    roomName: string,
    memoNumber: string
  ) {
    return this.create({
      userId,
      type: "MEMO_READY" as NotificationType,
      title: "Memo Siap Diunduh",
      message: `Memo ${memoNumber} untuk ruangan ${roomName} siap diunduh`,
      link: `/dashboard/mahasiswa/tracking`,
      metadata: { bookingId, roomName, memoNumber },
    });
  }
}
