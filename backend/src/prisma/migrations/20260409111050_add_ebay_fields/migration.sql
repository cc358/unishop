-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "ebayItemId" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'local';
