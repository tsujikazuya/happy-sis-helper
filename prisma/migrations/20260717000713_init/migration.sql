-- CreateTable
CREATE TABLE "PostDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "direction" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "snsType" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "targetAudience" TEXT,
    "ctaType" TEXT,
    "additionalInfo" TEXT,
    "generatedTitle" TEXT NOT NULL,
    "generatedHook" TEXT NOT NULL,
    "generatedBody" TEXT NOT NULL,
    "generatedShort" TEXT NOT NULL,
    "generatedCta" TEXT NOT NULL,
    "generatedTags" TEXT NOT NULL,
    "imageConcept" TEXT NOT NULL
);
