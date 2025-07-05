// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        badgeNumber: { label: "Badge Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { badgeNumber, password } = credentials;

        const db = await connectDB();
        const user = await db.collection("users").findOne({ badgeNumber });

        if (!user) return null;

        // If you store clear password, compare directly (not recommended)
        // const isValid = password === user.password;
        // If you use hashed password:
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        // Return user object for session
        return {
          id: user._id.toString(),
          name: user.name || "User",
          badgeNumber: user.badgeNumber,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // On initial sign in, add user data to token
      if (user) {
        token.badgeNumber = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add token info to session user
      if (token) {
        session.user = {
          email: token.badgeNumber as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
