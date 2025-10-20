-- AlterTable
ALTER TABLE "modules" ADD COLUMN "category" TEXT DEFAULT 'Uncategorized';
ALTER TABLE "modules" ADD COLUMN "difficulty" TEXT DEFAULT 'Beginner';
ALTER TABLE "modules" ADD COLUMN "duration" INTEGER DEFAULT 0;
ALTER TABLE "modules" ADD COLUMN "status" TEXT DEFAULT 'Concept';
ALTER TABLE "modules" ADD COLUMN "tags" TEXT;
