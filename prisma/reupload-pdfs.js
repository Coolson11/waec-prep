require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log(`Connecting to database at ${url.host}`);
} else {
  console.log('DATABASE_URL is not set!');
}

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function migrate() {
  const papers = await prisma.paper.findMany();
  console.log(`Found ${papers.length} papers to migrate.`);

  for (const paper of papers) {
    console.log(`Migrating paper: ${paper.title} (${paper.id})`);
    const rawCloudinaryUrl = paper.cloudinaryUrl.replace(/\s+/g, '');
    console.log(`Current URL (cleaned): ${rawCloudinaryUrl}`);

    try {
      // Simpler public ID extraction
      const match = rawCloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      if (!match) {
        throw new Error(`Could not parse Cloudinary URL: ${paper.cloudinaryUrl}`);
      }
      
      const publicId = match[1];
      console.log(`Extracted Public ID: ${publicId}`);

      // Generate a signed URL
      const signedUrl = cloudinary.url(publicId, {
        resource_type: "image",
        sign_url: true,
        secure: true,
      });

      console.log(`Signed URL generated.`);

      console.log(`Downloading from Cloudinary...`);
      const response = await axios.get(signedUrl, { 
        responseType: 'arraybuffer',
        timeout: 10000 
      });
      const buffer = Buffer.from(response.data);
      console.log(`Downloaded ${buffer.length} bytes.`);

      console.log(`Re-uploading to Cloudinary as raw...`);
      const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${buffer.toString('base64')}`, {
        folder: "waec-prep",
        resource_type: "raw",
        access_mode: "public",
      });

      console.log(`New URL: ${uploadResult.secure_url}`);

      await prisma.paper.update({
        where: { id: paper.id },
        data: {
          cloudinaryUrl: uploadResult.secure_url,
        },
      });
      console.log(`Successfully updated ${paper.title}`);
    } catch (error) {
      console.error(`Failed to migrate ${paper.title}:`, error.message);
    }
  }
}

migrate()
  .then(() => {
    console.log('Migration finished.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
