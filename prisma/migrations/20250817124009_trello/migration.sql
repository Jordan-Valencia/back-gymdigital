-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "public"."boards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "listId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attachments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "type" TEXT,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."lists" ADD CONSTRAINT "lists_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_listId_fkey" FOREIGN KEY ("listId") REFERENCES "public"."lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."labels" ADD CONSTRAINT "labels_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
