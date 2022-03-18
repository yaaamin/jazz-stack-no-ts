import bcrypt from "@node-rs/bcrypt";
import { prisma } from "../db.server";

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  return user;
}

export async function deleteUserByEmail(email) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.verify(password, userWithPassword.password.hash);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
