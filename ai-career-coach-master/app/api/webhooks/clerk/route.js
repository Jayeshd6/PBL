import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set.");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the Svix signature headers sent by Clerk
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the raw request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature to ensure it's really from Clerk
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`Clerk Webhook received: ${eventType}`);

  // Handle user deletion
  if (eventType === "user.deleted") {
    const { id: clerkUserId } = evt.data;

    if (!clerkUserId) {
      return new Response("Missing user ID in webhook payload", { status: 400 });
    }

    try {
      // Find the user in our database
      const user = await db.user.findUnique({
        where: { clerkUserId },
      });

      if (!user) {
        console.log(`User with clerkUserId ${clerkUserId} not found in DB. Skipping.`);
        return new Response("User not found, nothing to delete", { status: 200 });
      }

      // Delete all related records first (cascading manually since Prisma needs explicit deletes)
      await db.assessment.deleteMany({ where: { userId: user.id } });
      await db.coverLetter.deleteMany({ where: { userId: user.id } });
      await db.resume.deleteMany({ where: { userId: user.id } });

      // Finally delete the user
      await db.user.delete({ where: { id: user.id } });

      console.log(`✅ Deleted user ${user.email} (clerkUserId: ${clerkUserId}) from database.`);
      return new Response("User deleted successfully", { status: 200 });
    } catch (error) {
      console.error("Error deleting user from database:", error.message);
      return new Response("Failed to delete user", { status: 500 });
    }
  }

  // Acknowledge all other event types without action
  return new Response("Webhook received", { status: 200 });
}
