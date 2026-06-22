import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDb() {
  try {
    const businesses = await prisma.business.findMany();
    console.log("=== Businesses ===");
    businesses.forEach(b => console.log(`ID: ${b.id}, Name: ${b.name}`));

    const settings = await prisma.globalSettings.findMany();
    console.log("\n=== Global Settings ===");
    settings.forEach(s => console.log(`BusinessID in Settings: ${s.businessId}, Company: ${s.companyName}`));

    const inquiries = await prisma.contactInquiry.findMany();
    console.log(`\nInquiries Count: ${inquiries.length}`);
    if (inquiries.length > 0) {
      console.log("Latest Inquiry BusinessID:", inquiries[inquiries.length-1].businessId);
    }

  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
