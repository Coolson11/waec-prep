/*
  Warnings:

  - You are about to drop the column `facultyId` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_facultyId_fkey";

-- DropIndex
DROP INDEX "Subject_name_facultyId_key";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "facultyId";

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");
