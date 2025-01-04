import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event);
    const token = cookies.notes_jwt;

    if (!token) {
      throw createError({
        status: 401,
        message: "Not authorized to access notes",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const notes = await prisma.note.findMany({
      where: {
        userId: decodedToken.id,
      },
    });
    return notes;
  } catch (error) {
    console.log(error);
  }
});
