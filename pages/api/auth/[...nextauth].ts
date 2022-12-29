import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { databaseUsers } from "../../../database";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}


export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [

        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@gmail.com' },
                password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
            },
            async authorize(credentials): Promise<any> {
                console.log(credentials)
                /* return { id: '1', name: 'Juan', correo: 'juan@google.com', role: 'admin' }; */
                return await databaseUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
    ],

    // Callbacks
    callbacks: {
        async jwt({ token, account, user }) {
            /* console.log({ token, account, user }); */
            if (account) {
                token.accessToken = account.access_token;
                switch (account.type) {

                    case 'oauth':
                        token.user = await databaseUsers.oAuthToDbUser(user?.email || '', user?.name || '');
                        break

                    case 'credentials':
                        token.user = user;
                        break;

                }
            }
            return token;
        },
        async session({ session, token, user }) {
            /* console.log({ session, token, user }); */
            session.accessToken = token.accessToken as any;
            session.user = token.user as any;
            return session;
        }
    }
}

export default NextAuth(authOptions)