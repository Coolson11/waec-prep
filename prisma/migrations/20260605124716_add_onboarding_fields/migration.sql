-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facultyId" TEXT,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_UserSelectedSubjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSelectedSubjects_AB_unique" ON "_UserSelectedSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSelectedSubjects_B_index" ON "_UserSelectedSubjects"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSelectedSubjects" ADD CONSTRAINT "_UserSelectedSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSelectedSubjects" ADD CONSTRAINT "_UserSelectedSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
