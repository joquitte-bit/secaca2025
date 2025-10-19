-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "durationMinutes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "difficulty" TEXT,
    "tags" TEXT,
    "category" TEXT,
    "videoUrl" TEXT,
    "orgId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lessons_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lessons" ("content", "createdAt", "durationMinutes", "id", "moduleId", "order", "title", "type", "updatedAt") SELECT "content", "createdAt", "durationMinutes", "id", "moduleId", "order", "title", "type", "updatedAt" FROM "lessons";
DROP TABLE "lessons";
ALTER TABLE "new_lessons" RENAME TO "lessons";
CREATE INDEX "lessons_moduleId_order_idx" ON "lessons"("moduleId", "order");
CREATE INDEX "lessons_orgId_idx" ON "lessons"("orgId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
