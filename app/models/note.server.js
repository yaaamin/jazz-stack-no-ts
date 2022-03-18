import { prisma } from "../db.server";

export function getNote({ userId, id }) {
  return prisma.note.findFirst({
    where: { id, userId },
  });
}

export function getNoteListItems({ userId }) {
  return prisma.note.findMany({
    where: { userId: userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({ title, body, userId }) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({ id, userId }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}

//Saved for future reference
// export type { Note } from "@prisma/client";
