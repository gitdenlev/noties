import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!validator.isEmail(body.email)) {
      throw createError({
        status: 400,
        message: "Invalid email",
      });
    }

    if (
      !validator.isStrongPassword(body.password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      throw createError({
        status: 400,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    const isValid = await bcrypt.compare(body.password, user.password);

    console.log("Is Valid:" + isValid);

    console.log(isValid);

    if (!isValid) {
      throw createError({
        status: 400,
        message: "Username or password is invalid",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    setCookie(event, "notes_jwt", token);

    return { data: "Success!" };
  } catch (error) {
    console.log(error.code);

    if (error.code === "P2002") {
      throw createError({
        status: 409,
        message: "Email already exists",
      });
    }
    throw error;
  }
});
