/*
  Warnings:

  - You are about to drop the column `isRead` on the `Memo` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Memo` table. All the data in the column will be lost.
  - You are about to drop the column `receiverRole` on the `Memo` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Memo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memoNumber]` on the table `Memo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Memo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuedAt` to the `Memo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoNumber` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_BOOKING', 'BOOKING_VALIDATED', 'BOOKING_APPROVED', 'BOOKING_REJECTED', 'MEMO_READY');

-- DropForeignKey
ALTER TABLE "Memo" DROP CONSTRAINT "Memo_senderId_fkey";

-- AlterTable
ALTER TABLE "Memo" DROP COLUMN "isRead",
DROP COLUMN "message",
DROP COLUMN "receiverRole",
DROP COLUMN "senderId",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "memoNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Memo_memoNumber_key" ON "Memo"("memoNumber");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
