import type { User, Record } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Record } from "@prisma/client";

export function getRecord({
  id,
  userId,
}: Pick<Record, "id"> & {
  userId: User["id"];
}) {
  return prisma.record.findFirst({
    select: { id: true, title: true },
    where: { id, userId },
  });
}

export function getRecordListItems({ userId }: { userId: User["id"] }) {
  return prisma.record.findMany({
    where: { userId },
    // select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createRecord({
  title,
  userId,
}: Pick<Record, "title"> & {
  userId: User["id"];
}) {
  return prisma.record.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteRecord({
  id,
  userId,
}: Pick<Record, "id"> & { userId: User["id"] }) {
  return prisma.record.deleteMany({
    where: { id, userId },
  });
}
