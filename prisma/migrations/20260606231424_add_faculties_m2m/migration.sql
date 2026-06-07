-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_facultyId_fkey";

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "facultyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_FacultyToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FacultyToSubject_AB_unique" ON "_FacultyToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_FacultyToSubject_B_index" ON "_FacultyToSubject"("B");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToSubject" ADD CONSTRAINT "_FacultyToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToSubject" ADD CONSTRAINT "_FacultyToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
