-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Order Placed';
