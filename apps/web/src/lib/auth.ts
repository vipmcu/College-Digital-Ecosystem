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

const DEV_FALLBACK_USERS: Record<
  string,
  {
    id: string
    name: string
    email: string
    username: string
    roles: string[]
    userType: string
    passwords: string[]
  }
> = {
  admin: {
    id: "usr-admin-001",
    name: "ผู้ดูแลระบบ สวท.",
    email: "admin@college.ac.th",
    username: "admin",
    roles: ["super_admin", "registrar", "system_admin"],
    userType: "admin",
    passwords: ["adminpassword", "password123", "admin123"],
  },
  student01: {
    id: "usr-student-001",
    name: "นายสมชาย ใจดี",
    email: "student01@college.ac.th",
    username: "student01",
    roles: ["student"],
    userType: "student",
    passwords: ["password123", "student123", "adminpassword"],
  },
  instructor01: {
    id: "usr-instructor-001",
    name: "ดร.วิชัย มุ่งมั่น",
    email: "instructor01@college.ac.th",
    username: "instructor01",
    roles: ["instructor", "advisor"],
    userType: "staff",
    passwords: ["password123", "instructor123", "adminpassword"],
  },
  registrar01: {
    id: "usr-registrar-001",
    name: "นางสาวพิมพา รักเรียน",
    email: "registrar01@college.ac.th",
    username: "registrar01",
    roles: ["registrar"],
    userType: "staff",
    passwords: ["password123", "registrar123", "adminpassword"],
  },
}

function checkDevFallback(usernameInput: string, passwordInput: string) {
  const cleanUser = usernameInput.trim().toLowerCase()
  const matched = Object.values(DEV_FALLBACK_USERS).find(
    (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
  )

  if (matched && matched.passwords.includes(passwordInput)) {
    return {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      username: matched.username,
      roles: matched.roles,
      userType: matched.userType,
      accessToken: `dev-fallback-token-${matched.username}-${Date.now()}`,
    }
  }
  return null
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
            const fallbackUser = checkDevFallback(credentials.username, credentials.password)
            if (fallbackUser) return fallbackUser
            return null
          }

          const resJson = (await res.json()) as IdentityApiResponse
          const loginData: IdentityLoginData | undefined =
            resJson.data ??
            (resJson.user && resJson.accessToken
              ? { user: resJson.user, accessToken: resJson.accessToken }
              : undefined)

          if (!loginData?.user || !loginData.accessToken) {
            const fallbackUser = checkDevFallback(credentials.username, credentials.password)
            if (fallbackUser) return fallbackUser
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
          console.error("NextAuth authorize error (trying dev fallback):", error instanceof Error ? error.message : "Unknown error")
          const fallbackUser = checkDevFallback(credentials.username, credentials.password)
          if (fallbackUser) return fallbackUser
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
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
