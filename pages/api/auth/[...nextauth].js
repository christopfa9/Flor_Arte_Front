import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {

    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProvider({
            id: "credentials",
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                
                const { username, password } = credentials;
                // El endpoint a utilizar para el login se define aquí
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/login`, {
                    method: "POST",
                    body: JSON.stringify({ username, password }),
                    headers: { "Content-Type": "application/json" }
                })
                // Grab JWT from response header.
                const token = res.headers.get('Authorization'); // Get the Authorization header

                if (token && token.startsWith('Bearer ')) {
                    const user = await res.json()

                    // Optionally, you might want to strip the 'Bearer ' prefix
                    const bearerToken = token.substring(7);

                    if (user) {
                        // You can attach the token to the user object, or handle it as needed
                        user.token = bearerToken;
                        return user;
                    } else {
                        return null;
                    }
                }

            }
        })
    ],

    callbacks: {
        // How to get the token.
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        // Store token's session in NextAuth secure storage.
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.user = token;
            // session.authorities
            return session;
        },
    },
    pages: {
        // Page where the login is done.
        signIn: "/auth/login",
    },
}

export default NextAuth(authOptions)