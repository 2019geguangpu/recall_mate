-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'task',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "scheduledAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "repeatPattern" JSONB,
    "smartTiming" JSONB,
    "tags" JSONB,
    "category" TEXT,
    "voiceRecordId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_records" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'note',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "audioUrl" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "transcript" TEXT,
    "confidence" DOUBLE PRECISION,
    "extractedInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sleepPattern" JSONB,
    "workPattern" JSONB,
    "healthNeeds" JSONB,
    "behaviorPattern" JSONB,
    "memoryCharacteristics" JSONB,
    "consumptionPreferences" JSONB,
    "habitAnalysis" JSONB,
    "personalityTags" JSONB,
    "profileCompleteness" INTEGER NOT NULL DEFAULT 0,
    "lastAnalysisDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_scheduledAt_idx" ON "tasks"("scheduledAt");

-- CreateIndex
CREATE INDEX "tasks_createdAt_idx" ON "tasks"("createdAt");

-- CreateIndex
CREATE INDEX "tasks_voiceRecordId_idx" ON "tasks"("voiceRecordId");

-- CreateIndex
CREATE INDEX "voice_records_createdAt_idx" ON "voice_records"("createdAt");

-- CreateIndex
CREATE INDEX "voice_records_status_idx" ON "voice_records"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_voiceRecordId_fkey" FOREIGN KEY ("voiceRecordId") REFERENCES "voice_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
