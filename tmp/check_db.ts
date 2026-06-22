import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDb() {
  try {
    const businesses = await prisma.business.findMany();
    console.log("Businesses:", JSON.stringify(businesses, null, 2));

    const settings = await prisma.globalSettings.findMany();
    console.log("Global Settings:", JSON.stringify(settings, null, 2));

    const inquiries = await prisma.contactInquiry.findMany();
    console.log("Inquiries Count:", inquiries.length);
    console.log("Latest Inquiries:", JSON.stringify(inquiries.slice(-2), null, 2));

  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
