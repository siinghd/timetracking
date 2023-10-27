import { connectToDatabase } from '@/app/config/db';
import User from '@/models/user.model';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (
        (user?.email?.endsWith('@redergo.com') ||
          user?.email?.endsWith('@avrean.com') ||
          user?.email?.endsWith('@avrean.net')) &&
        profile?.email_verified === true
      ) {
        await connectToDatabase();
        let userfromMongo: any = await User.findOne({ email: user?.email });
        if (!userfromMongo) {
          userfromMongo = await User.create({
            email: user?.email,
            fullName: user?.name,
            picture: user?.image,
            providerAccountId: account?.providerAccountId,
            provider: account?.provider,
            role: user?.email.split('.').includes('tommaso') ? 'admin' : 'user',
          });
        }

        // Return user information to be stored in the session
        return true;
      } else {
        return false;
      }
    },
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token }: { token: any }) {
      await connectToDatabase();
      const user = await User.findOne({ email: token?.email });
      if (user) token.role = user.role; // user.role was set in the signIn callback

      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login', // Set this to the path of your custom login page
  },
};
