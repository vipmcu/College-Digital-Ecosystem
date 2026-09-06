import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

interface IdentityUserData {
  id: string
  username: string
  email: string
  firstNameTh: string
  lastNameTh: string
  roles: string[]
  userType: string
}

interface IdentityLoginData {
  user: IdentityUserData
  accessToken: string
}

interface IdentityApiResponse {
  data?: IdentityLoginData
  user?: IdentityUserData
  accessToken?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "College Digital Credentials",
      credentials: {
        username: { label: "ชื่อผู้ใช้งาน หรือ อีเมล", type: "text", placeholder: "student01 หรือ admin" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const authUrl = process.env.IDENTITY_SERVICE_URL || "http://localhost:4001"
          const res = await fetch(`${authUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            return null
          }

          const resJson = (await res.json()) as IdentityApiResponse
          const loginData: IdentityLoginData | undefined =
            resJson.data ??
            (resJson.user && resJson.accessToken
              ? { user: resJson.user, accessToken: resJson.accessToken }
              : undefined)

          if (!loginData?.user || !loginData.accessToken) {
            return null
          }

          const user = loginData.user
          return {
            id: user.id,
            name: `${user.firstNameTh} ${user.lastNameTh}`.trim(),
            email: user.email,
            username: user.username,
            roles: user.roles,
            userType: user.userType,
            accessToken: loginData.accessToken,
          }
        } catch (error) {
          console.error("NextAuth authorize error:", error instanceof Error ? error.message : "Unknown error")
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes for admin/privileged sessions per PRD/architecture
  },
  secret: process.env.NEXTAUTH_SECRET || "college-digital-ecosystem-super-secret-key-32-chars",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.roles = user.roles
        token.userType = user.userType
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id ?? ""
        session.user.username = token.username ?? ""
        session.user.roles = token.roles ?? []
        session.user.userType = token.userType ?? ""
        session.user.accessToken = token.accessToken
      }
      return session
    },
  },
}
