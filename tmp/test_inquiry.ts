import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testInquiry() {
  try {
    const business = await prisma.business.findFirst();
    if (!business) {
        console.error("No business found. Cannot test.");
        return;
    }

    console.log(`Testing with Business ID: ${business.id}`);

    // 1. Test /api/public/inquiry (Plan Menu)
    console.log("\n--- Testing /api/public/inquiry ---");
    const publicData = {
        name: "Test User Public",
        phone: "1234567890",
        items: ["Item 1", "Item 2"],
        totalCost: 500,
        businessId: business.id
    };

    const res1 = await fetch("http://localhost:3000/api/public/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publicData)
    });

    if (res1.ok) {
        console.log("Public inquiry submission: SUCCESS");
        const json = await res1.json();
        console.log("Created Inquiry ID:", json.id);
    } else {
        console.error("Public inquiry submission: FAILED", res1.status, await res1.text());
    }

    // 2. Test /api/contact (Contact Form)
    console.log("\n--- Testing /api/contact ---");
    const contactData = {
        name: "Test User Contact",
        phone: "0987654321",
        email: "test@example.com",
        eventType: "Wedding",
        businessId: business.id
    };

    const res2 = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData)
    });

    if (res2.ok) {
        console.log("Contact inquiry submission: SUCCESS");
        const json = await res2.json();
        console.log("Created Inquiry ID:", json.id);
    } else {
        console.error("Contact inquiry submission: FAILED", res2.status, await res2.text());
    }

    // 3. Verify in DB
    const finalCount = await prisma.contactInquiry.count();
    console.log(`\nFinal Inquiry Count in DB: ${finalCount}`);

  } catch (error) {
    console.error("Error during testing:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testInquiry();
