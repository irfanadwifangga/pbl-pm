# Database Indexes Documentation

## Notification Table Indexes

### Current Status

The Notification table currently has only automatic primary key index on `id`.

### Recommended Indexes

Based on query patterns in the application:

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  link      String?
  isRead    Boolean          @default(false)
  readAt    DateTime?
  metadata  Json?
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // INDEXES TO ADD:
  @@index([userId, createdAt(sort: Desc)])  // For getByUserId query (sorted by recent)
  @@index([userId, isRead])                  // For getUnreadCount and markAllAsRead queries
  @@index([createdAt])                       // For cleanup/retention queries
}
```

### Performance Impact

1. **userId + createdAt composite index**
   - Query: `getByUserId()` with `orderBy: { createdAt: "desc" }`
   - Benefit: Eliminates full table scan for user's notifications
   - Expected improvement: O(n) → O(log n + k) where k = result limit

2. **userId + isRead composite index**
   - Query: `getUnreadCount()` and `markAllAsRead()`
   - Benefit: Fast filtering of unread notifications per user
   - Expected improvement: O(n) → O(log n)

3. **createdAt index**
   - Query: Future retention policy cleanup (e.g., `deleteOlderThan()`)
   - Benefit: Efficient range queries for date-based operations

### Migration Command

To add these indexes, create a new migration:

```bash
npx prisma migrate dev --name add_notification_indexes
```

### Trade-offs

**Pros:**

- Faster queries (especially as data grows)
- Better scalability for multiple concurrent users
- Reduced database CPU usage

**Cons:**

- Slightly slower writes (INSERT/UPDATE)
- Additional storage space (~5-10% overhead)
- Migration downtime (minimal, < 1 second for empty/small tables)

### When to Apply

- **Now**: If you expect > 100 notifications per user
- **Soon**: Within first week of production deployment
- **Later**: Can defer if < 50 total users and < 1000 total notifications

### Testing Indexes

After adding indexes, verify with:

```sql
-- PostgreSQL
EXPLAIN ANALYZE
SELECT * FROM "Notification"
WHERE "userId" = 'user_id_here'
ORDER BY "createdAt" DESC
LIMIT 50;

-- Should show "Index Scan" instead of "Seq Scan"
```
