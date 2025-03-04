"use server";

import { prisma } from "@/lib/prisma";

export async function getLoginMethod(userId: string) {
  const res = await prisma.account.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!res) return null;
  return res.provider;
}

export async function isUserOnboarded(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  return user?.onboarded ?? false;
}

export async function isCodeUnique(code: string) {
  const codeExist = await prisma.classroom.findUnique({
    where: {
      code: code,
    },
  });
  return !codeExist;
}

export async function getClassIdFromCode(code: string) {
  const classroom = await prisma.classroom.findUnique({
    where: {
      code: code,
    },
  });
  return classroom?.id;
}
