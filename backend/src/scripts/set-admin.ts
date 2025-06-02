import { prisma } from "../config/db.config";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Script to set a user as admin by email
 * Usage: npx ts-node src/scripts/set-admin.ts admin@example.com
 */
async function setUserAsAdmin() {
  try {
    const email = process.argv[2];
      if (!email) {
      console.error("Please provide an email address");
      console.log("Usage: npx ts-node src/scripts/set-admin.ts admin@example.com");
      process.exit(1);
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update the user to be an admin
    await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });

    console.log(`User ${email} has been set as admin successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Error setting user as admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setUserAsAdmin();