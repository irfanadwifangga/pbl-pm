# Calendar View & Conflict Detection Features

## Overview

This document describes the Calendar View and Conflict Detection features added to the room booking system. These features help students visualize booking schedules and prevent booking conflicts.

## Features

### 1. Calendar View (`/dashboard/mahasiswa/kalender`)

A visual calendar interface that displays all room bookings in an interactive calendar format.

**Key Features:**

- **Multiple Views**: Month, Week, Day, and Agenda views
- **Color-Coded Events**: Events are color-coded by booking status:
  - 🟨 **Amber**: Pending (awaiting validation)
  - 🟪 **Violet**: Validated (awaiting approval)
  - 🟩 **Green**: Approved
  - 🟥 **Red**: Rejected
- **Event Details**: Click on any event to view booking details in a modal
- **Indonesian Locale**: Calendar displays in Indonesian language
- **Responsive Design**: Works on desktop and mobile devices

**Components:**

- `components/CalendarView.tsx`: Main calendar component
- `components/mahasiswa/CalendarPageClient.tsx`: Client wrapper with data fetching
- `app/dashboard/mahasiswa/kalender/page.tsx`: Calendar page route

**API Endpoint:**

- `GET /api/booking/calendar`: Fetches booking data for calendar display
  - Caching: 3 minutes TTL
  - Rate Limiting: 100 requests/minute
  - Access Control:
    - Students: See approved bookings + their own bookings
    - Admin/Wadir: See all bookings

### 2. Conflict Detection

Real-time booking conflict detection that alerts users when their selected time slot conflicts with existing bookings and suggests alternative rooms.

**Key Features:**

- **Real-Time Detection**: Automatically checks for conflicts when room, start time, or end time changes
- **Visual Alerts**:
  - 🟢 **Green**: No conflicts - room is available
  - 🔴 **Red**: Conflicts detected with conflict list
  - 🔵 **Blue**: Alternative room suggestions
- **Conflict Details**: Shows conflicting booking information (event name, time, requester)
- **Alternative Rooms**: Suggests available rooms with:
  - Same building
  - 80%+ capacity match
  - No time conflicts
- **Edit Mode Support**: Excludes current booking when editing (via `currentBookingId` prop)

**Components:**

- `components/ConflictDetection.tsx`: Conflict detection component (167 lines)

**API Endpoint:**

- `GET /api/booking/check-conflict`: Checks for booking conflicts
  - Query Parameters:
    - `roomId`: Room to check (required)
    - `startTime`: Start datetime ISO string (required)
    - `endTime`: End datetime ISO string (required)
    - `currentBookingId`: Booking ID to exclude (optional, for edit mode)
  - Response:
    ```typescript
    {
      hasConflict: boolean;
      conflicts: Array<{
        id: string;
        eventName: string;
        startTime: string;
        endTime: string;
        user: { name: string; nim: string };
      }>;
      alternativeRooms: Array<{
        id: string;
        name: string;
        building: string;
        capacity: number;
      }>;
    }
    ```
  - Rate Limiting: 100 requests/minute

**Integration:**

- Integrated into `components/BookingForm.tsx`
- Displays between date/time pickers and event name field
- Only shows when room, start time, and end time are selected

## Technical Implementation

### Dependencies

```json
{
  "react-big-calendar": "^1.15.0",
  "date-fns": "^4.1.0",
  "@types/react-big-calendar": "^1.8.12"
}
```

### Database Queries

**Conflict Detection Logic:**

```typescript
// Time overlap detection using OR conditions
where: {
  roomId: roomId,
  status: { in: ["PENDING", "VALIDATED", "APPROVED"] },
  OR: [
    // New booking starts during existing booking
    { startTime: { lte: startTime }, endTime: { gt: startTime } },
    // New booking ends during existing booking
    { startTime: { lt: endTime }, endTime: { gte: endTime } },
    // New booking completely contains existing booking
    { startTime: { gte: startTime }, endTime: { lte: endTime } },
  ]
}
```

**Alternative Room Finder:**

```typescript
// Find rooms in same building with similar capacity
where: {
  building: currentRoom.building,
  capacity: { gte: Math.floor(currentRoom.capacity * 0.8) },
  bookings: {
    none: {
      status: { in: ["PENDING", "VALIDATED", "APPROVED"] },
      OR: [/* same time overlap logic */]
    }
  }
}
```

### Caching Strategy

- **Calendar Data**: 3-minute TTL using Redis
  - Cache Key: `booking:calendar:${userId}:${role}`
  - Invalidation: Automatic via TTL
- **Conflict Check**: Not cached (real-time validation required)

### Rate Limiting

Both endpoints use Redis-based rate limiting:

- 100 requests per minute per IP address
- Returns 429 status code when limit exceeded

## User Flow

### Calendar View

1. Student navigates to "Kalender Peminjaman" from sidebar
2. Calendar loads with all approved bookings + student's own bookings
3. Student can switch between Month/Week/Day/Agenda views
4. Student clicks on event to view booking details
5. Modal displays event information (room, time, status, requester)

### Conflict Detection

1. Student starts creating a booking in "Ajukan Peminjaman"
2. Student selects room, start time, and end time
3. ConflictDetection component automatically checks for conflicts
4. If conflicts found:
   - Red alert displays list of conflicting bookings
   - Blue section shows alternative rooms (if available)
5. Student can either:
   - Change time/room to avoid conflict
   - Select an alternative room
6. Green checkmark appears when slot is available
7. Student proceeds to fill remaining fields and submit

## Navigation

**Sidebar Update:**

- Added "Kalender Peminjaman" link to mahasiswa sidebar
- Positioned between "Ajukan Peminjaman" and "Tracking Peminjaman"
- Uses Calendar icon from lucide-react

## Performance Optimizations

1. **Lazy Loading**: Calendar component loads data on demand
2. **Debounced Conflict Checks**: Prevents excessive API calls during form input
3. **Cached Calendar Data**: 3-minute cache reduces database load
4. **Rate Limiting**: Prevents API abuse
5. **Optimized Queries**: Indexed database fields for fast conflict detection

## Future Enhancements

Potential improvements for future versions:

- [ ] Export calendar to ICS format
- [ ] Email notifications for upcoming bookings
- [ ] Calendar filtering by room/building
- [ ] Bulk booking availability checker
- [ ] Calendar sharing/embedding
- [ ] Recurring booking pattern detection
- [ ] Capacity-based conflict warnings (near-capacity alerts)

## Testing

**Manual Testing Checklist:**

- [x] Calendar displays all bookings correctly
- [x] Events show correct colors based on status
- [x] Event modal displays booking details
- [x] Calendar switches between views (Month/Week/Day)
- [x] Conflict detection triggers on room/time change
- [x] Conflicts display with correct booking details
- [x] Alternative rooms suggested when available
- [x] No conflicts show green checkmark
- [x] API endpoints return correct data
- [x] Caching works (check Redis)
- [x] Rate limiting prevents excessive requests

## API Documentation

### GET /api/booking/calendar

**Description**: Fetches booking data for calendar display

**Authentication**: Required (session-based)

**Query Parameters**: None

**Response**: 200 OK

```typescript
Array<{
  id: string;
  eventName: string;
  purpose: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  status: "PENDING" | "VALIDATED" | "APPROVED" | "REJECTED";
  room: {
    name: string;
    building: string;
  };
  user: {
    name: string;
    nim: string;
  };
}>;
```

**Caching**: 3 minutes

**Rate Limit**: 100 req/min

---

### GET /api/booking/check-conflict

**Description**: Checks for booking conflicts and suggests alternatives

**Authentication**: Required (session-based)

**Query Parameters**:

- `roomId` (required): UUID of room to check
- `startTime` (required): ISO 8601 datetime string
- `endTime` (required): ISO 8601 datetime string
- `currentBookingId` (optional): UUID of booking to exclude (for edits)

**Response**: 200 OK

```typescript
{
  hasConflict: boolean;
  conflicts: Array<{
    id: string;
    eventName: string;
    startTime: string;
    endTime: string;
    user: {
      name: string;
      nim: string;
    };
  }>;
  alternativeRooms: Array<{
    id: string;
    name: string;
    building: string;
    capacity: number;
  }>;
}
```

**Rate Limit**: 100 req/min

**Error Responses**:

- 400: Missing required parameters
- 401: Unauthorized
- 429: Rate limit exceeded
- 500: Server error

## Troubleshooting

### Calendar not loading data

- Check authentication status
- Verify API endpoint is accessible
- Check browser console for errors
- Verify Redis cache is working

### Conflict detection not triggering

- Ensure room, start time, and end time are all selected
- Check browser console for API errors
- Verify date/time format is valid ISO 8601
- Check rate limiting status

### Alternative rooms not showing

- Verify there are rooms in the same building
- Check capacity threshold (80% minimum)
- Ensure alternative rooms have no conflicts
- Review database queries in API logs

## Credits

**Libraries Used:**

- [react-big-calendar](https://github.com/jquense/react-big-calendar) - Calendar component
- [date-fns](https://date-fns.org/) - Date manipulation
- [Lucide React](https://lucide.dev/) - Icons

**Implementation Date**: November 2024

**Version**: 1.0.0
