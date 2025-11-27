import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { NotificationService } from "@/lib/services/notification.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parallel queries for better performance
    const [notifications, unreadCount] = await Promise.all([
      NotificationService.getByUserId(session.user.id),
      NotificationService.getUnreadCount(session.user.id),
    ]);

    return NextResponse.json(
      {
        notifications,
        unreadCount,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
