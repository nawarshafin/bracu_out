import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import { UserService } from "../../../lib/models/User";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "nawar",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { email, username, password } = credentials as any;
        
        // Validate input - require password and either email or username
        if (!password) {
          console.log('Authentication failed: No password provided');
          return null;
        }
        
        if (!email && !username) {
          console.log('Authentication failed: No email or username provided');
          return null;
        }

        try {
          // Find user by email or username
          let user = null;
          
          // Priority order: email first, then username, then combined search
          if (email && email.trim()) {
            console.log(`Attempting to find user by email: ${email}`);
            user = await UserService.findByEmail(email.trim());
          }
          
          if (!user && username && username.trim()) {
            console.log(`Attempting to find user by username: ${username}`);
            user = await UserService.findByUsername(username.trim());
          }
          
          // Fallback: try finding by either field
          if (!user && (email || username)) {
            const searchTerm = (email || username).trim();
            console.log(`Attempting combined search for: ${searchTerm}`);
            user = await UserService.findByEmailOrUsername(searchTerm);
          }
          
          if (!user) {
            console.log(`Authentication failed: User not found for ${email || username}`);
            return null;
          }
          
          console.log(`User found: ${user.email} (${user.role})`);

          // Validate password
          if (!user.password) {
            console.log(`Authentication failed: No password stored for user ${user.email}`);
            return null;
          }
          
          const isValidPassword = await UserService.validatePassword(password, user.password);
          
          if (!isValidPassword) {
            console.log(`Authentication failed: Invalid password for user ${user.email}`);
            return null;
          }
          
          console.log(`Authentication successful: ${user.email} logged in as ${user.role}`);

          // Return user object for session (excluding password)
          return {
            id: user._id?.toString() || user.email,
            name: user.name,
            userName: user.userName || user.email.split('@')[0], // fallback to email prefix
            role: user.role,
            email: user.email
          };
        } catch (error) {
          console.error('Authentication system error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
