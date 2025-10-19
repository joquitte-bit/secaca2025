-- Redo the migration with proper defaults
PRAGMA foreign_keys=OFF;
CREATE TABLE "_modules_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy existing data with default values
INSERT INTO "_modules_new" ("id", "courseId", "title", "order", "createdAt", "updatedAt")
SELECT "id", "courseId", "title", "order", "createdAt", "createdAt" FROM "modules";

-- Drop old table and rename new one
DROP TABLE "modules";
ALTER TABLE "_modules_new" RENAME TO "modules";

-- Create indexes
CREATE INDEX "modules_courseId_order_idx" ON "modules"("courseId", "order");
PRAGMA foreign_keys=ON;