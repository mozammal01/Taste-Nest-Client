"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const { error: reqError } = await authClient.emailOtp.requestPasswordReset({
      email,
    });

    setIsLoading(false);

    if (reqError) {
      setError(reqError.message || "Failed to send reset code.");
      return;
    }

    setMessage("If that email exists, we sent a reset code.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white to-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
        <p className="text-sm text-gray-600 mt-1">We’ll email you a one-time code to reset your password.</p>

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {message && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <AnimatedButton type="submit" variant="ripple" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset code"}
          </AnimatedButton>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link className="text-primary hover:underline" href="/reset-password">
            Already have a code?
          </Link>
          <Link className="text-gray-600 hover:underline" href="/signin">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

