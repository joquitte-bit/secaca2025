-- Maak de junction table aan
CREATE TABLE "lesson_on_module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("moduleId") REFERENCES "modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migreer bestaande data
INSERT INTO "lesson_on_module" ("id", "moduleId", "lessonId", "order")
SELECT 
    lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6))) as id,
    "moduleId",
    "id" as "lessonId",
    "order"
FROM "lessons" 
WHERE "moduleId" IS NOT NULL;

-- Voeg unique constraint toe
CREATE UNIQUE INDEX "lesson_on_module_moduleId_lessonId_key" ON "lesson_on_module"("moduleId", "lessonId");