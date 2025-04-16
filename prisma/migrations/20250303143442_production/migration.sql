-- CreateTable
CREATE TABLE `File`
(
    `id`              INTEGER      NOT NULL AUTO_INCREMENT,
    `filename`        VARCHAR(255) NOT NULL,
    `initialFilename` VARCHAR(255) NOT NULL,
    `path`            VARCHAR(255) NOT NULL,
    `uri`             VARCHAR(255) NOT NULL,
    `createdAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User`
(
    `id`                 INTEGER      NOT NULL AUTO_INCREMENT,
    `email`              VARCHAR(255) NOT NULL,
    `password`           VARCHAR(255) NULL,
    `firstName`          VARCHAR(255) NULL,
    `lastName`           VARCHAR(255) NULL,
    `lastLoginDate`      DATETIME(3) NOT NULL,
    `createdAt`          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `googleAccessToken`  TEXT NULL,
    `googleRefreshToken` TEXT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AutoInstruction`
(
    `id`          INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT    NOT NULL,
    `order`       INTEGER NOT NULL,
    `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3) NOT NULL,
    `userId`      INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AutoInstructionSuggestion`
(
    `id`          INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT    NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `token`     VARCHAR(191) NOT NULL,
    `platform`  ENUM('WEB', 'MOBILE') NOT NULL,
    `userId`    INTEGER      NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Device_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchHistory`
(
    `id`         INTEGER      NOT NULL AUTO_INCREMENT,
    `userId`     INTEGER      NOT NULL,
    `searchTerm` VARCHAR(191) NOT NULL,
    `searchDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `token`     VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId`    INTEGER      NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note`
(
    `id`         INTEGER      NOT NULL AUTO_INCREMENT,
    `title`      VARCHAR(191) NOT NULL,
    `content`    LONGTEXT NULL,
    `createdAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3) NOT NULL,
    `userId`     INTEGER      NOT NULL,
    `notebookId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notebook`
(
    `id`     INTEGER      NOT NULL AUTO_INCREMENT,
    `title`  VARCHAR(191) NOT NULL,
    `userId` INTEGER      NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag`
(
    `id`   INTEGER      NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoteCollaboration`
(
    `id`              INTEGER NOT NULL AUTO_INCREMENT,
    `permissionLevel` ENUM('READ', 'WRITE', 'ADMIN') NOT NULL,
    `noteId`          INTEGER NOT NULL,
    `userId`          INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task`
(
    `id`                       INTEGER      NOT NULL AUTO_INCREMENT,
    `title`                    VARCHAR(191) NOT NULL,
    `description`              VARCHAR(191) NOT NULL,
    `dueDate`                  DATETIME(3) NULL,
    `completed`                BOOLEAN      NOT NULL DEFAULT false,
    `userId`                   INTEGER      NOT NULL,
    `notificationPreferenceId` INTEGER NULL,
    `notificationSent`         BOOLEAN NULL DEFAULT false,
    `token`                    VARCHAR(191) NULL,

    UNIQUE INDEX `Task_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invitation`
(
    `id`                         INTEGER NOT NULL AUTO_INCREMENT,
    `receiverId`                 INTEGER NULL,
    `senderId`                   INTEGER NOT NULL,
    `externalEmailInvitation`    VARCHAR(191) NULL,
    `tokenForExternalInvitation` VARCHAR(191) NULL,
    `isExternal`                 BOOLEAN NOT NULL DEFAULT false,
    `isRelation`                 BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event`
(
    `id`                       INTEGER      NOT NULL AUTO_INCREMENT,
    `title`                    VARCHAR(191) NOT NULL,
    `description`              VARCHAR(191) NOT NULL,
    `startDate`                DATETIME(3) NOT NULL,
    `endDate`                  DATETIME(3) NOT NULL,
    `isRecurring`              BOOLEAN NULL DEFAULT false,
    `recurrence`               ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL') NULL DEFAULT 'NONE',
    `location`                 VARCHAR(191) NOT NULL,
    `place`                    VARCHAR(191) NULL,
    `link`                     VARCHAR(191) NULL,
    `createdAt`                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId`                   INTEGER      NOT NULL,
    `notificationPreferenceId` INTEGER NULL,
    `notificationSent`         BOOLEAN NULL DEFAULT false,
    `token`                    VARCHAR(191) NULL,

    UNIQUE INDEX `Event_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSharedWithMember`
(
    `eventId` INTEGER NOT NULL,
    `userId`  INTEGER NOT NULL,

    PRIMARY KEY (`eventId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `content`   VARCHAR(191) NOT NULL,
    `userId`    INTEGER      NOT NULL,
    `noteId`    INTEGER      NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResetToken`
(
    `id`              INTEGER      NOT NULL AUTO_INCREMENT,
    `token`           VARCHAR(191) NOT NULL,
    `validityEndDate` DATETIME(3) NOT NULL,
    `userId`          INTEGER      NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Score`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `userId`    INTEGER      NOT NULL,
    `time`      INTEGER      NOT NULL,
    `level`     ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `firstName` VARCHAR(191) NOT NULL,
    `lastName`  VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoteTask`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `title`     VARCHAR(191) NOT NULL,
    `completed` BOOLEAN      NOT NULL DEFAULT false,
    `noteId`    INTEGER      NOT NULL,
    `userId`    INTEGER      NOT NULL,
    `parentId`  INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationPreference`
(
    `id`         INTEGER NOT NULL AUTO_INCREMENT,
    `userId`     INTEGER NOT NULL,
    `timeBefore` INTEGER NOT NULL,
    `timeUnit`   ENUM('MINUTES', 'HOURS', 'DAYS') NOT NULL,
    `createdAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NotificationPreference_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationPreferenceType`
(
    `id`                       INTEGER NOT NULL AUTO_INCREMENT,
    `type`                     ENUM('EMAIL', 'PUSH') NOT NULL,
    `notificationPreferenceId` INTEGER NOT NULL,
    `createdAt`                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyPlan`
(
    `id`        INTEGER NOT NULL AUTO_INCREMENT,
    `date`      DATETIME(3) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `userId`    INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DailyPlan_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyTask`
(
    `id`            INTEGER      NOT NULL AUTO_INCREMENT,
    `uniqueTaskId`  VARCHAR(191) NOT NULL,
    `title`         VARCHAR(191) NOT NULL,
    `description`   VARCHAR(191) NULL,
    `scheduledDate` DATETIME(3) NOT NULL,
    `originalDate`  DATETIME(3) NULL,
    `carriedOver`   BOOLEAN      NOT NULL DEFAULT false,
    `order`         INTEGER      NOT NULL,
    `priority`      INTEGER      NOT NULL,
    `completed`     BOOLEAN      NOT NULL DEFAULT false,
    `completedAt`   DATETIME(3) NULL,
    `userId`        INTEGER      NOT NULL,
    `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DailyTask_uniqueTaskId_key`(`uniqueTaskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyTaskHistory`
(
    `id`            INTEGER      NOT NULL AUTO_INCREMENT,
    `uniqueTaskId`  VARCHAR(191) NOT NULL,
    `title`         VARCHAR(191) NOT NULL,
    `description`   VARCHAR(191) NULL,
    `scheduledDate` DATETIME(3) NOT NULL,
    `originalDate`  DATETIME(3) NULL,
    `carriedOver`   BOOLEAN      NOT NULL DEFAULT false,
    `order`         INTEGER      NOT NULL,
    `priority`      INTEGER      NOT NULL,
    `completed`     BOOLEAN      NOT NULL DEFAULT false,
    `completedAt`   DATETIME(3) NULL,
    `userId`        INTEGER      NOT NULL,
    `archivedAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DailyTaskHistory_uniqueTaskId_key`(`uniqueTaskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalendarEventInvitation`
(
    `id`              INTEGER      NOT NULL AUTO_INCREMENT,
    `senderId`        INTEGER      NOT NULL,
    `receiverId`      INTEGER NULL,
    `receiverEmail`   VARCHAR(191) NOT NULL,
    `calendarEventId` INTEGER      NOT NULL,
    `status`          ENUM('PENDING', 'ACCEPTED', 'REFUSED') NOT NULL DEFAULT 'PENDING',
    `updatedAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalendarEvent`
(
    `id`                       INTEGER NOT NULL AUTO_INCREMENT,
    `googleEventId`            VARCHAR(191) NULL,
    `eventType`                ENUM('TASK', 'EVENT') NOT NULL DEFAULT 'EVENT',
    `title`                    TEXT NULL,
    `description`              TEXT    NOT NULL,
    `dueDate`                  DATETIME(3) NULL,
    `startDate`                DATETIME(3) NULL,
    `endDate`                  DATETIME(3) NULL,
    `isRecurring`              BOOLEAN NULL DEFAULT false,
    `recurrence`               ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL') NULL DEFAULT 'NONE',
    `location`                 TEXT NULL,
    `link`                     TEXT NULL,
    `token`                    VARCHAR(191) NULL,
    `userId`                   INTEGER NOT NULL,
    `notificationPreferenceId` INTEGER NULL,
    `pushNotificationSent`     BOOLEAN NULL DEFAULT false,
    `emailNotificationSent`    BOOLEAN NULL DEFAULT false,
    `createdAt`                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CalendarEvent_googleEventId_key`(`googleEventId`),
    UNIQUE INDEX `CalendarEvent_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Link`
(
    `id`           VARCHAR(191) NOT NULL,
    `url`          VARCHAR(191) NOT NULL,
    `ownerId`      INTEGER      NOT NULL,
    `imageId`      INTEGER NULL,
    `screenShotAt` DATETIME(3) NULL,

    UNIQUE INDEX `Link_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinkGroup`
(
    `id`          VARCHAR(191) NOT NULL,
    `title`       VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `userId`      INTEGER      NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinkGroupLink`
(
    `linkGroupId`  VARCHAR(191) NOT NULL,
    `linkId`       VARCHAR(191) NOT NULL,
    `linkName`     VARCHAR(191) NOT NULL,
    `clickCounter` INTEGER      NOT NULL DEFAULT 0,

    PRIMARY KEY (`linkGroupId`, `linkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NoteTags`
(
    `A`   INTEGER NOT NULL,
    `B`   INTEGER NOT NULL,

    UNIQUE INDEX `_NoteTags_AB_unique`(`A`, `B`),
    INDEX `_NoteTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AutoInstruction`
    ADD CONSTRAINT `AutoInstruction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device`
    ADD CONSTRAINT `Device_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SearchHistory`
    ADD CONSTRAINT `SearchHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session`
    ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note`
    ADD CONSTRAINT `Note_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note`
    ADD CONSTRAINT `Note_notebookId_fkey` FOREIGN KEY (`notebookId`) REFERENCES `Notebook` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notebook`
    ADD CONSTRAINT `Notebook_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoteCollaboration`
    ADD CONSTRAINT `NoteCollaboration_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoteCollaboration`
    ADD CONSTRAINT `NoteCollaboration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task`
    ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task`
    ADD CONSTRAINT `Task_notificationPreferenceId_fkey` FOREIGN KEY (`notificationPreferenceId`) REFERENCES `NotificationPreference` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation`
    ADD CONSTRAINT `Invitation_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation`
    ADD CONSTRAINT `Invitation_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event`
    ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event`
    ADD CONSTRAINT `Event_notificationPreferenceId_fkey` FOREIGN KEY (`notificationPreferenceId`) REFERENCES `NotificationPreference` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSharedWithMember`
    ADD CONSTRAINT `EventSharedWithMember_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSharedWithMember`
    ADD CONSTRAINT `EventSharedWithMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetToken`
    ADD CONSTRAINT `ResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score`
    ADD CONSTRAINT `Score_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoteTask`
    ADD CONSTRAINT `NoteTask_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoteTask`
    ADD CONSTRAINT `NoteTask_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoteTask`
    ADD CONSTRAINT `NoteTask_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `NoteTask` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationPreference`
    ADD CONSTRAINT `NotificationPreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationPreferenceType`
    ADD CONSTRAINT `NotificationPreferenceType_notificationPreferenceId_fkey` FOREIGN KEY (`notificationPreferenceId`) REFERENCES `NotificationPreference` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPlan`
    ADD CONSTRAINT `DailyPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTask`
    ADD CONSTRAINT `DailyTask_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTaskHistory`
    ADD CONSTRAINT `DailyTaskHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEventInvitation`
    ADD CONSTRAINT `CalendarEventInvitation_calendarEventId_fkey` FOREIGN KEY (`calendarEventId`) REFERENCES `CalendarEvent` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEventInvitation`
    ADD CONSTRAINT `CalendarEventInvitation_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEventInvitation`
    ADD CONSTRAINT `CalendarEventInvitation_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEvent`
    ADD CONSTRAINT `CalendarEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEvent`
    ADD CONSTRAINT `CalendarEvent_notificationPreferenceId_fkey` FOREIGN KEY (`notificationPreferenceId`) REFERENCES `NotificationPreference` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link`
    ADD CONSTRAINT `Link_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link`
    ADD CONSTRAINT `Link_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `File` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkGroup`
    ADD CONSTRAINT `LinkGroup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkGroupLink`
    ADD CONSTRAINT `LinkGroupLink_linkGroupId_fkey` FOREIGN KEY (`linkGroupId`) REFERENCES `LinkGroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkGroupLink`
    ADD CONSTRAINT `LinkGroupLink_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoteTags`
    ADD CONSTRAINT `_NoteTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Note` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoteTags`
    ADD CONSTRAINT `_NoteTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;