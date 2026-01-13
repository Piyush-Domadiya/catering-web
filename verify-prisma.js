const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    console.log("Checking for globalSettings on prisma client...");
    if (prisma.globalSettings) {
      console.log("SUCCESS: globalSettings is available on prisma client.");
    } else {
      console.log("FAILURE: globalSettings is NOT available on prisma client.");
    }
  } catch (error) {
    console.error("ERROR during verification:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
