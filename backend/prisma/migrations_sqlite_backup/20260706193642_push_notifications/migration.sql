-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "mobilityLevel" INTEGER NOT NULL DEFAULT 3,
    "equipmentOwned" TEXT NOT NULL DEFAULT '[]',
    "knownEnvironmentFeatures" TEXT NOT NULL DEFAULT '[]',
    "fontSize" TEXT NOT NULL DEFAULT 'large',
    "highContrast" BOOLEAN NOT NULL DEFAULT false,
    "reduceMotion" BOOLEAN NOT NULL DEFAULT false,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "streakFreezesAvailable" INTEGER NOT NULL DEFAULT 2,
    "lastCompletedDate" TEXT,
    "freezeRefillMonth" TEXT,
    "xpTotal" INTEGER NOT NULL DEFAULT 0,
    "unlockedCosmetics" TEXT NOT NULL DEFAULT '[]',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" TEXT,
    "lastReminderSentDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UserProfile" ("createdAt", "email", "equipmentOwned", "fontSize", "freezeRefillMonth", "highContrast", "id", "knownEnvironmentFeatures", "lastCompletedDate", "longestStreak", "mobilityLevel", "onboardingCompleted", "reduceMotion", "streakCount", "streakFreezesAvailable", "unlockedCosmetics", "xpTotal") SELECT "createdAt", "email", "equipmentOwned", "fontSize", "freezeRefillMonth", "highContrast", "id", "knownEnvironmentFeatures", "lastCompletedDate", "longestStreak", "mobilityLevel", "onboardingCompleted", "reduceMotion", "streakCount", "streakFreezesAvailable", "unlockedCosmetics", "xpTotal" FROM "UserProfile";
DROP TABLE "UserProfile";
ALTER TABLE "new_UserProfile" RENAME TO "UserProfile";
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");
