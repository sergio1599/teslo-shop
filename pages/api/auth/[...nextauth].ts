import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        /* FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        }) */
    ],

    //Custom Pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    // Callbacks

    jwt: {},
    session: {
        maxAge: 2592300, //30 días
        strategy: 'jwt',
        updateAge: 86400, //cada día
    },
    callbacks: {
        async jwt({ token, account, user }) {
            console.log({ token, account, user });
            if (account) {
                token.accessToken = account.access_token;
                switch (account.type) {

                    case 'oauth':
                        token.user = await databaseUsers.oAUthToDbUser(user?.email || '', user?.name || '');
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