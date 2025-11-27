# Project Architecture - Best Practices

## 📁 Struktur Folder

```
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (thin layer)
│   │   └── booking/
│   │       ├── route.ts          # GET & POST bookings
│   │       └── [id]/route.ts     # PATCH booking status
│   ├── dashboard/                # Dashboard pages (UI only)
│   │   ├── mahasiswa/            # Student dashboard
│   │   ├── admin/                # Admin dashboard
│   │   └── wadir/                # Wadir dashboard
│   └── login/                    # Login page
│
├── components/                   # Reusable UI Components
│   ├── ui/                       # Shadcn UI primitives
│   ├── BookingForm.tsx           # Booking form (UI only)
│   ├── StatsCard.tsx             # Stats display card
│   ├── ActionCard.tsx            # Action/link card
│   ├── RoomCard.tsx              # Room information card
│   └── StatusBadge.tsx           # Status badge
│
├── lib/                          # Core logic & utilities
│   ├── actions/                  # Server Actions (Next.js 15)
│   │   └── booking.actions.ts    # Booking CRUD actions
│   ├── services/                 # Business Logic Layer
│   │   ├── booking.service.ts    # Booking business logic
│   │   ├── room.service.ts       # Room business logic
│   │   └── stats.service.ts      # Statistics business logic
│   ├── validations/              # Zod schemas
│   │   └── booking.ts            # Booking validation schemas
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React Hooks
│   └── useBookingForm.ts         # Booking form logic hook
│
├── types/                        # TypeScript types
│   └── index.ts                  # Shared types & interfaces
│
└── prisma/                       # Database
    ├── schema.prisma             # Database schema
    └── seed.ts                   # Database seeding
```

## 🏗️ Architecture Layers

### 1. **Presentation Layer** (Components)

- **Lokasi**: `components/`
- **Tanggung jawab**: Pure UI components, no business logic
- **Contoh**: `BookingForm.tsx`, `StatsCard.tsx`, `ActionCard.tsx`
- **Prinsip**: Hanya menerima props dan menampilkan UI

### 2. **Page Layer** (App Router)

- **Lokasi**: `app/`
- **Tanggung jawab**: Routing, data fetching, layout
- **Contoh**: `app/dashboard/mahasiswa/page.tsx`
- **Prinsip**: Fetch data menggunakan Services, pass to Components

### 3. **Business Logic Layer** (Services)

- **Lokasi**: `lib/services/`
- **Tanggung jawab**: Business logic, database operations
- **Contoh**: `BookingService`, `RoomService`, `StatsService`
- **Prinsip**: Single Responsibility, reusable functions

### 4. **Data Access Layer** (Actions & API Routes)

- **Lokasi**: `lib/actions/` & `app/api/`
- **Tanggung jawab**: Server-side operations, mutations
- **Server Actions**: For form submissions, mutations (Next.js 15)
- **API Routes**: For external API access, webhooks

### 5. **Validation Layer**

- **Lokasi**: `lib/validations/`
- **Tanggung jawab**: Data validation schemas
- **Tool**: Zod schemas
- **Prinsip**: Single source of truth for validation

### 6. **Custom Hooks Layer**

- **Lokasi**: `hooks/`
- **Tanggung jawab**: Reusable client-side logic
- **Contoh**: `useBookingForm`
- **Prinsip**: Encapsulate stateful logic

### 7. **Type Layer**

- **Lokasi**: `types/`
- **Tanggung jawab**: TypeScript definitions
- **Prinsip**: Shared types across the app

## 🔄 Data Flow

```
User Interaction
      ↓
Component (UI)
      ↓
Custom Hook (Client Logic)
      ↓
Server Action (Server-side)
      ↓
Service (Business Logic)
      ↓
Prisma (Database)
      ↓
Response back through layers
```

## ✅ Best Practices Implemented

### 1. **Separation of Concerns**

- UI components tidak berisi business logic
- Business logic di Services, bukan di API routes
- Validation schemas terpisah dan reusable

### 2. **Single Responsibility Principle**

- Setiap class/function punya satu tanggung jawab
- `BookingService` hanya handle booking logic
- `StatsService` hanya handle statistics

### 3. **DRY (Don't Repeat Yourself)**

- Reusable components: `StatsCard`, `ActionCard`
- Shared validation schemas
- Centralized service functions

### 4. **Type Safety**

- Strong TypeScript typing di semua layer
- Shared types di `types/index.ts`
- Zod schemas untuk runtime validation

### 5. **Server Actions (Next.js 15)**

- Menggunakan Server Actions untuk mutations
- Automatic serialization
- Type-safe client-server communication

### 6. **Error Handling**

- Consistent error responses
- Try-catch di semua async operations
- User-friendly error messages

## 📝 Usage Examples

### Creating a New Feature

#### 1. Define Types

```typescript
// types/index.ts
export interface NewFeatureData {
  id: string;
  name: string;
}
```

#### 2. Create Validation Schema

```typescript
// lib/validations/feature.ts
export const featureSchema = z.object({
  name: z.string().min(3),
});
```

#### 3. Create Service

```typescript
// lib/services/feature.service.ts
export class FeatureService {
  static async create(data: FeatureData) {
    return await prisma.feature.create({ data });
  }
}
```

#### 4. Create Server Action

```typescript
// lib/actions/feature.actions.ts
"use server";
export async function createFeatureAction(data: FeatureData) {
  const validated = featureSchema.parse(data);
  return await FeatureService.create(validated);
}
```

#### 5. Create Hook (if needed)

```typescript
// hooks/useFeature.ts
export function useFeature() {
  const submit = async (data) => {
    return await createFeatureAction(data);
  };
  return { submit };
}
```

#### 6. Create Component

```typescript
// components/FeatureForm.tsx
export function FeatureForm() {
  const { submit } = useFeature();
  // UI only
}
```

## 🎯 Benefits

1. **Maintainability**: Easy to locate and update code
2. **Testability**: Each layer can be tested independently
3. **Scalability**: Easy to add new features
4. **Reusability**: Components and services are reusable
5. **Type Safety**: Strong typing prevents runtime errors
6. **Performance**: Optimized with Next.js 15 features
7. **Developer Experience**: Clear structure, easy onboarding

## 🚀 Next Steps

- [ ] Add unit tests for services
- [ ] Add integration tests for actions
- [ ] Add E2E tests with Playwright
- [ ] Add API documentation
- [ ] Add error boundary components
- [ ] Add loading states
- [ ] Add optimistic UI updates
