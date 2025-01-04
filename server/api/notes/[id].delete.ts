import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Получаем ID из параметров маршрута
    const id = await getRouterParam(event, "id");

    // Проверяем, авторизован ли пользователь (если необходимо)
    const cookies = parseCookies(event);
    const token = cookies.notes_jwt;

    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Not authorized to delete",
      });
    }

    // Удаляем заметку с указанным ID
    await prisma.note.delete({
      where: {
        id: Number(id),
      },
    });

    return {
      message: `Note with ID ${id} successfully deleted`,
    };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      message: "An error occurred while deleting the note",
    });
  }
});
