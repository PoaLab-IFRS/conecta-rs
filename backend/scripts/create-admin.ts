import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";

const email = process.env.ADMIN_EMAIL ?? "admin@conecta.rs";
const name = process.env.ADMIN_NAME ?? "Administrador";
const password = process.env.ADMIN_PASSWORD ?? "Admin@12345";

async function main() {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: "admin", tipoUser: "ADMIN" },
      });
      console.log(`Administrador já existente atualizado: ${email}`);
    } else {
      await auth.api.createUser({
        body: {
          email,
          name,
          password,
          role: "admin",
          data: { tipoUser: "ADMIN" },
        },
      });
      console.log(`Administrador criado: ${email}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
