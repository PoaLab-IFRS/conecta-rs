import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma.js";
import { sendPasswordResetEmail } from "./email.js";

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET não foi definida");
}

const frontendOrigin =
  process.env.FRONTEND_URL ?? "http://localhost:5173";

export const auth = betterAuth({
  appName: "Conecta RS",
  baseURL:
    process.env.BETTER_AUTH_BASE_URL ?? "http://localhost:3000",
  secret,

  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  trustedOrigins: [frontendOrigin],

  user: {
    additionalFields: {
      tipoUser: {
        type: "string",
        required: true,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    resetPasswordTokenExpiration: 3600,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});