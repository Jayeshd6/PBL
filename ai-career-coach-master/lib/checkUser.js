import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0].emailAddress;
  const name = `${user.firstName} ${user.lastName}`;

  try {
    // Step 1: Try to find user by clerkUserId (the happy path)
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Step 2: Check if the email already exists (e.g. user recreated their Clerk account)
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      // Update the stale clerkUserId to the new one
      return await db.user.update({
        where: { email },
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
        },
      });
    }

    // Step 3: Brand new user — safe to create
    return await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });
  } catch (error) {
    console.error("checkUser error:", error.message);
    // Last resort fallback
    return await db.user.findUnique({
      where: { clerkUserId: user.id },
    });
  }
};
