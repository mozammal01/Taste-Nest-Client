"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const { error: resetError } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message || "Failed to reset password.");
      return;
    }

    setMessage("Password reset successful. You can sign in now.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white to-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="text-sm text-gray-600 mt-1">Enter the code from your email and set a new password.</p>

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {message && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">OTP code</Label>
            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
          </div>

          <AnimatedButton type="submit" variant="ripple" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </AnimatedButton>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link className="text-primary hover:underline" href="/forgot-password">
            Resend code
          </Link>
          <Link className="text-gray-600 hover:underline" href="/signin">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}