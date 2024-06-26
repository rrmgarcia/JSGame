import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import clientPromise from './mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { sendVerificationRequest } from '@/lib/email';

// Google provider
function getGoogleCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing Google OAuth credentials');
  }
  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
      allowDangerousEmailAccountLinking: true,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        provider: 'google',
      }),
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.provider = account?.provider;
        token.name = user.name;
        token.image = user.image || profile?.picture;
      }

      // Always fetch the latest user information from the database
      const client = await clientPromise;
      const db = client.db();
      const dbUser = await db.collection('users').findOne({ email: token.email });

      if (dbUser) {
        token.name = dbUser.name;
        token.image = dbUser.image;
      }

      // console.log('JWT callback:', token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.provider = token.provider as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      // console.log('Session callback:', session);
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/email-check',
    error: '/auth/error',
  },
};

export const getAuthSession = () => getServerSession(authOptions);
