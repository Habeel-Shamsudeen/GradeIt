"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const updateUserName = async (name: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
};

export const updateOnboardingStatus = async (onboarded: boolean) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        onboarded: onboarded,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
};

export const updateUserRole = async (role: Role) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        role: role,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
};
