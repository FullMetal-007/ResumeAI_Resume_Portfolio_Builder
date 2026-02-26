import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here"
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
                }),
            ]
            : []),
        CredentialsProvider({
            id: "guest",
            name: "Guest",
            credentials: {},
            async authorize() {
                return {
                    id: "guest-user-123",
                    name: "Guest User",
                    email: "guest@example.com",
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "dev-secret-at-least-32-chars-long-!!!",
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.userId) {
                (session.user as { id?: string }).id = token.userId as string;
            }
            return session;
        },
    },
    debug: true,
};

export default authOptions;
