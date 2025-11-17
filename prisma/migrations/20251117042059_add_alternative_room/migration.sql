-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "alternativeRoomId" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_alternativeRoomId_fkey" FOREIGN KEY ("alternativeRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
