import NextAuth, { NextAuthOptions} from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import GitHubProvider from "next-auth/providers/github"
import clientPromise from '@/lib/mongodb'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      balance?: number // Add the balance property
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image: string
    balance?: number // Add the balance property
  }
}


export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        session.user.balance = user.balance 
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

