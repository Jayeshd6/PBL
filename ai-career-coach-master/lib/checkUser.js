import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
    // If concurrent requests or email conflicts happen, handle them gracefully.
    try {
      const email = user.emailAddresses[0].emailAddress;
      const existingUserByEmail = await db.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        // If the email exists but clerkUserId is different (e.g. account deleted and recreated in Clerk)
        if (existingUserByEmail.clerkUserId !== user.id) {
          return await db.user.update({
            where: { email },
            data: { clerkUserId: user.id },
          });
        }
        return existingUserByEmail;
      }
    } catch (e) {
      console.error(e.message);
    }
    
    // Fallback just in case
    return await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
  }
};
