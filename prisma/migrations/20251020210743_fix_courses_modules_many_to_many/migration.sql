/*
  Warnings:

  - You are about to drop the column `courseId` on the `modules` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "course_on_module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "course_on_module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_on_module_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_modules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT DEFAULT 'Uncategorized',
    "status" TEXT DEFAULT 'Concept',
    "duration" INTEGER DEFAULT 0,
    "difficulty" TEXT DEFAULT 'Beginner',
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_modules" ("category", "createdAt", "description", "difficulty", "duration", "id", "order", "status", "tags", "title", "updatedAt") SELECT "category", "createdAt", "description", "difficulty", "duration", "id", "order", "status", "tags", "title", "updatedAt" FROM "modules";
DROP TABLE "modules";
ALTER TABLE "new_modules" RENAME TO "modules";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "course_on_module_courseId_moduleId_key" ON "course_on_module"("courseId", "moduleId");
