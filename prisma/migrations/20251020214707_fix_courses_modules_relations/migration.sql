-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_modules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT DEFAULT 'Uncategorized',
    "status" TEXT DEFAULT 'CONCEPT',
    "duration" INTEGER DEFAULT 0,
    "difficulty" TEXT DEFAULT 'BEGINNER',
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_modules" ("category", "createdAt", "description", "difficulty", "duration", "id", "order", "status", "tags", "title", "updatedAt") SELECT "category", "createdAt", "description", "difficulty", "duration", "id", "order", "status", "tags", "title", "updatedAt" FROM "modules";
DROP TABLE "modules";
ALTER TABLE "new_modules" RENAME TO "modules";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
