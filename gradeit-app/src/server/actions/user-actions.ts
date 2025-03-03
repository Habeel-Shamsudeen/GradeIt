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
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!user) {
      throw new Error("No user found");
    }
    if (user.name === name) {
      return { status: "success", message: "No changes detected" };
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating name:", error);
    return { success: false };
  }
};

export const updateOnboardingStatus = async (onboarded: boolean) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!user) {
      throw new Error("No user found");
    }
    if (user.onboarded === onboarded) {
      return { status: "success", message: "No changes detected" };
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboarded },
    });
    return { status: "success" };
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return { status: "failed" };
  }
};

export const updateUserRole = async (role: Role) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      }
    });
    if(!user){
      throw new Error("No user found");
    }
    if(user.role === role){
      return { status: "success", message: "No changes detected" };
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });
    return { status: "success" };
  } catch (error) {
    console.error("Error updating role:", error);
    return { status: "failed" };
  }
};

export const getUserRole = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select:{
        role:true
      }
    });
    if (!user) {
      throw new Error("No user found");
    }
    return { role: user.role, status: "success" };
  } catch (error) {
    console.error("Error:", error);
    return { status: "failed"};
  }
};
