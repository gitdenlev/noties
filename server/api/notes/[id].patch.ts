import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = await getRouterParam(event, "id");
    const cookies = parseCookies(event);
    const token = cookies.notes_jwt;

    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Not authorized to update",
      });
    }

    await prisma.note.update({
      where: {
        id: Number(id),
      },
      data: {
        text: body.updatedNote,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
