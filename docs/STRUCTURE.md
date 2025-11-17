# 📊 Project Structure Visualization

## 🎯 Current Structure (After Refactoring)

```
pbl-pm/
│
├── 📱 app/                          # Next.js App Router
│   ├── api/                         # API Routes (Thin Layer)
│   │   ├── auth/[...nextauth]/
│   │   ├── booking/
│   │   │   ├── route.ts            # GET & POST bookings
│   │   │   └── [id]/route.ts       # PATCH booking status
│   │   └── rooms/route.ts
│   │
│   ├── dashboard/                   # Protected Pages
│   │   ├── layout.tsx              # Dashboard layout with Sidebar
│   │   ├── mahasiswa/              # Student Dashboard
│   │   │   ├── page.tsx            # Stats + Recent bookings
│   │   │   └── booking/page.tsx    # Create booking form
│   │   ├── admin/                  # Admin Dashboard
│   │   │   └── page.tsx            # Validation queue
│   │   └── wadir/                  # Wadir Dashboard
│   │       └── page.tsx            # Approval queue
│   │
│   ├── login/page.tsx              # Login page
│   ├── unauthorized/page.tsx       # 403 page
│   ├── page.tsx                    # Root redirect
│   └── layout.tsx                  # Root layout
│
├── 🎨 components/                   # UI Components (Pure)
│   ├── ui/                         # Shadcn UI Primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   ├── textarea.tsx
│   │   └── badge.tsx
│   │
│   ├── BookingForm.tsx             # Booking form (UI only)
│   ├── RoomCard.tsx                # Room display card
│   ├── StatusBadge.tsx             # Status badge
│   ├── StatsCard.tsx               # Stats display card ✨ NEW
│   ├── ActionCard.tsx              # Action/link card ✨ NEW
│   └── Sidebar.tsx                 # Navigation sidebar
│
├── 🔧 lib/                          # Core Logic & Utilities
│   ├── actions/                    # Server Actions ✨ NEW
│   │   ├── booking.actions.ts      # CRUD actions
│   │   └── index.ts                # Exports
│   │
│   ├── services/                   # Business Logic ✨ NEW
│   │   ├── booking.service.ts      # Booking operations
│   │   ├── room.service.ts         # Room operations
│   │   ├── stats.service.ts        # Statistics
│   │   └── index.ts                # Exports
│   │
│   ├── validations/                # Zod Schemas ✨ NEW
│   │   └── booking.ts              # Booking validation
│   │
│   ├── auth.ts                     # NextAuth config
│   ├── prisma.ts                   # Prisma client
│   └── utils.ts                    # Helper functions
│
├── 🪝 hooks/                        # Custom Hooks ✨ NEW
│   └── useBookingForm.ts           # Form logic hook
│
├── 📝 types/                        # TypeScript Types ✨ NEW
│   └── index.ts                    # Shared types
│
├── 🗄️ prisma/                       # Database
│   ├── schema.prisma               # Schema definition
│   └── seed.ts                     # Seed data
│
├── 📚 Documentation
│   ├── ARCHITECTURE.md             # Architecture guide ✨ NEW
│   ├── REFACTORING_SUMMARY.md      # Refactoring summary ✨ NEW
│   └── STRUCTURE.md                # This file ✨ NEW
│
└── ⚙️ Config Files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── middleware.ts
    └── .env
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                         │
│  📱 Components (Pure UI)                                      │
│  • BookingForm.tsx                                            │
│  • StatsCard.tsx                                              │
│  • ActionCard.tsx                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LOGIC LAYER                       │
│  🪝 Custom Hooks                                              │
│  • useBookingForm() - Form state & submission                 │
│  • useState, useEffect, etc.                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      SERVER ACTION LAYER                      │
│  ⚡ Server Actions (Next.js 15)                              │
│  • createBookingAction()                                      │
│  • updateBookingStatusAction()                                │
│  • Validation with Zod                                        │
│  • Authorization checks                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                       │
│  🔧 Services                                                  │
│  • BookingService.createBooking()                             │
│  • BookingService.checkAvailability()                         │
│  • StatsService.getStudentStats()                             │
│  • RoomService.getAvailableRooms()                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                        │
│  🗄️ Prisma ORM                                               │
│  • prisma.booking.create()                                    │
│  • prisma.booking.findMany()                                  │
│  • prisma.room.findMany()                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         DATABASE                              │
│  🐘 PostgreSQL                                                │
│  • Users, Rooms, Bookings, Memos                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Layer Responsibilities

### 1️⃣ **Presentation Layer** (Components)

```typescript
// ✅ DO: Pure UI rendering
export function BookingForm({ rooms }: Props) {
  const { loading, submitBooking } = useBookingForm();
  return <form onSubmit={handleSubmit}>...</form>;
}

// ❌ DON'T: Direct API calls or business logic
export function BookingForm() {
  const onSubmit = async () => {
    const response = await fetch('/api/booking');
    const conflict = await checkConflict(); // ❌ Business logic
  }
}
```

### 2️⃣ **Client Logic Layer** (Hooks)

```typescript
// ✅ DO: Encapsulate client-side stateful logic
export function useBookingForm() {
  const [loading, setLoading] = useState(false);
  const submitBooking = async (data) => {
    setLoading(true);
    const result = await createBookingAction(data);
    setLoading(false);
    return result;
  };
  return { loading, submitBooking };
}

// ❌ DON'T: Business logic or database operations
```

### 3️⃣ **Server Action Layer** (Actions)

```typescript
// ✅ DO: Handle mutations, validation, authorization
"use server";
export async function createBookingAction(data) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const validated = bookingSchema.parse(data);
  return await BookingService.createBooking(validated);
}

// ❌ DON'T: Direct database operations
```

### 4️⃣ **Business Logic Layer** (Services)

```typescript
// ✅ DO: Encapsulate business rules and database operations
export class BookingService {
  static async createBooking(data) {
    const isAvailable = await this.checkAvailability(...);
    if (!isAvailable) throw new Error("Room not available");
    return await prisma.booking.create({ data });
  }
}

// ❌ DON'T: UI rendering or authorization
```

### 5️⃣ **Data Access Layer** (Prisma)

```typescript
// ✅ DO: Database operations through services
await prisma.booking.create({ data });
await prisma.booking.findMany({ where });

// ❌ DON'T: Use directly in components or pages
```

---

## 📦 Module Dependencies

```
┌────────────────────────────────────────────────────────┐
│                      Components                         │
│  ├─ depends on → Hooks                                  │
│  ├─ depends on → Types                                  │
│  └─ depends on → UI Components                          │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│                        Hooks                            │
│  ├─ depends on → Server Actions                         │
│  ├─ depends on → Types                                  │
│  └─ depends on → React                                  │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│                   Server Actions                        │
│  ├─ depends on → Services                               │
│  ├─ depends on → Validations                            │
│  ├─ depends on → Types                                  │
│  └─ depends on → Auth                                   │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│                      Services                           │
│  ├─ depends on → Prisma                                 │
│  ├─ depends on → Types                                  │
│  └─ NO dependencies on UI/Hooks/Actions                 │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│                   Prisma/Database                       │
│  └─ NO dependencies on application code                 │
└────────────────────────────────────────────────────────┘
```

---

## 🔍 Feature Flow Example: Create Booking

```
Step 1: User fills form
  └─ Component: BookingForm.tsx
     └─ Renders form fields
     └─ Uses useBookingForm() hook

Step 2: User submits form
  └─ Hook: useBookingForm.ts
     └─ Sets loading state
     └─ Calls createBookingAction()

Step 3: Server validates data
  └─ Action: booking.actions.ts
     └─ Checks authentication
     └─ Validates with Zod schema
     └─ Calls BookingService

Step 4: Business logic executes
  └─ Service: booking.service.ts
     └─ Checks room availability
     └─ Validates time slots
     └─ Creates booking in DB

Step 5: Data persisted
  └─ Prisma ORM
     └─ Creates booking record
     └─ Returns created booking

Step 6: Response flows back
  └─ Service → Action → Hook → Component
     └─ Shows success toast
     └─ Redirects to dashboard
     └─ Revalidates cache
```

---

## 📊 Code Organization Metrics

### Before Refactoring

- ❌ Business logic mixed with UI
- ❌ Direct Prisma calls in pages
- ❌ Validation scattered across files
- ❌ Difficult to test
- ❌ Code duplication

### After Refactoring

- ✅ Clear separation of concerns
- ✅ Reusable service layer
- ✅ Centralized validation
- ✅ Easy to test each layer
- ✅ DRY principle applied

### File Count

- **Services**: 3 files
- **Actions**: 1 file
- **Hooks**: 1 file
- **Types**: 1 file
- **Validations**: 1 file
- **New Components**: 2 files
- **Documentation**: 3 files

---

## 🎓 Design Patterns Used

1. **Service Layer Pattern**
   - Encapsulate business logic
   - Reusable across API routes and Server Actions

2. **Repository Pattern** (via Services)
   - Abstract data access
   - Single source of truth for database operations

3. **Custom Hook Pattern**
   - Encapsulate stateful client logic
   - Reusable across components

4. **Server Actions Pattern** (Next.js 15)
   - Type-safe client-server communication
   - Automatic serialization

5. **Validation Layer Pattern**
   - Centralized validation schemas
   - Shared between client and server

---

## ✨ Summary

| Aspect              | Before    | After        |
| ------------------- | --------- | ------------ |
| **Separation**      | Mixed     | Clear layers |
| **Reusability**     | Low       | High         |
| **Testability**     | Difficult | Easy         |
| **Maintainability** | Medium    | High         |
| **Type Safety**     | Partial   | Full         |
| **Performance**     | Good      | Optimized    |

**Result**: Professional, maintainable, and scalable architecture! 🚀
