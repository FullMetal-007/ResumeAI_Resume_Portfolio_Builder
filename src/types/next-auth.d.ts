import "next-auth";

declare module "next-auth" {
    /**
     * Extends the built-in session.user object to include the id
     */
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    /**
     * Extends the built-in user object to include the id
     */
    interface User {
        id: string;
    }
}
