-- CreateIndex
CREATE INDEX "Booking_userId_status_idx" ON "Booking"("userId", "status");

-- CreateIndex
CREATE INDEX "Booking_roomId_startTime_idx" ON "Booking"("roomId", "startTime");

-- CreateIndex
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Room_building_isAvailable_idx" ON "Room"("building", "isAvailable");

-- CreateIndex
CREATE INDEX "Room_capacity_idx" ON "Room"("capacity");
