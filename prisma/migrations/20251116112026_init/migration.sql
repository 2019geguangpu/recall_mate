-- CreateTable
CREATE TABLE `tasks` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'task',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `scheduledAt` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,
    `repeatPattern` JSON NULL,
    `smartTiming` JSON NULL,
    `tags` JSON NULL,
    `category` VARCHAR(191) NULL,
    `voiceRecordId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,

    INDEX `tasks_status_idx`(`status`),
    INDEX `tasks_scheduledAt_idx`(`scheduledAt`),
    INDEX `tasks_createdAt_idx`(`createdAt`),
    INDEX `tasks_voiceRecordId_idx`(`voiceRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_records` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'note',
    `status` VARCHAR(191) NOT NULL DEFAULT 'completed',
    `audioUrl` VARCHAR(191) NULL,
    `duration` INTEGER NOT NULL DEFAULT 0,
    `transcript` VARCHAR(191) NULL,
    `confidence` DOUBLE NULL,
    `extractedInfo` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `voice_records_createdAt_idx`(`createdAt`),
    INDEX `voice_records_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sleepPattern` JSON NULL,
    `workPattern` JSON NULL,
    `healthNeeds` JSON NULL,
    `behaviorPattern` JSON NULL,
    `memoryCharacteristics` JSON NULL,
    `consumptionPreferences` JSON NULL,
    `habitAnalysis` JSON NULL,
    `personalityTags` JSON NULL,
    `profileCompleteness` INTEGER NOT NULL DEFAULT 0,
    `lastAnalysisDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_voiceRecordId_fkey` FOREIGN KEY (`voiceRecordId`) REFERENCES `voice_records`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
