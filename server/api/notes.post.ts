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

    const newNote = await prisma.note.create({
      data: {
        text: "",
        userId: decodedToken.id,
      },
    });
    return newNote;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Could not verify jwt",
    });
  }
});
