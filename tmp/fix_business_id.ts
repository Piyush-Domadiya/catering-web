import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixDb() {
  try {
    const business = await prisma.business.findFirst();
    if (!business) {
      console.log("No business found in database. Please run seeder first.");
      return;
    }

    console.log(`Fixing database for Business ID: ${business.id}`);

    // Update GlobalSettings to point to the correct business
    const settings = await prisma.globalSettings.findFirst();
    if (settings && settings.businessId !== business.id) {
        console.log(`Updating GlobalSettings from ${settings.businessId} to ${business.id}`);
        // First delete the old one if it's broken or just update the ID
        // Since businessId is @unique, we can't just update it easily if there's a constraint.
        // Actually, we can update it if the new ID exists.
        await prisma.globalSettings.update({
            where: { id: settings.id },
            data: { businessId: business.id }
        });
    } else if (!settings) {
        console.log("Creating default GlobalSettings");
        await prisma.globalSettings.create({
            data: {
                businessId: business.id,
                companyName: business.name,
                contactPhone: business.phone,
                contactEmail: business.email,
            }
        });
    }

    // Fix and existing inquiries that might have the wrong businessId
    const updateResult = await prisma.contactInquiry.updateMany({
        where: { businessId: "demo-business-id" },
        data: { businessId: business.id }
    });
    console.log(`Updated ${updateResult.count} inquiries.`);

    console.log("Database fix completed successfully.");

  } catch (error) {
    console.error("Error fixing DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDb();
