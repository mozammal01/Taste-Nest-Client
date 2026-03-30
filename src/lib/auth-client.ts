import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Use the current window origin when on client, or a provided APP_URL/localhost during build/SSR
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession, emailOtp } = authClient;
