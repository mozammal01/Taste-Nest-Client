"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordSchema } from "@/zod/auth.schema";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import logo from "@/../public/logo/logo.png";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate with Zod
      resetPasswordSchema.parse(formData);

      const { error: resetError } = await authClient.emailOtp.resetPassword({
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
      });

      if (resetError) {
        setError(resetError.message || "Failed to reset password.");
        toast.error(resetError.message || "Failed to reset password.");
        return;
      }

      toast.success("Password reset successfully!");
      setIsSuccess(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);

    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.issues[0].message;
        setError(firstError);
        toast.error(firstError);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-gray-50 to-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[32px] border border-gray-100 shadow-2xl p-10 text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 font-outfit">Reset Complete</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your password has been securely updated. <br />
            Redirecting you to sign in...
          </p>
          <NextLink href="/signin">
            <AnimatedButton variant="ripple" className="w-full h-14 text-lg font-bold">
              Sign In Now <ArrowRight className="ml-2 w-5 h-5" />
            </AnimatedButton>
          </NextLink>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white to-gray-50 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-gray-100 shadow-2xl p-8 md:p-10"
      >
        <div className="flex justify-center mb-8">
          <NextLink href="/">
             <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <Image src={logo} alt="TasteNest Logo" width={140} height={45} />
             </motion.div>
          </NextLink>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-outfit">Set New Password</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Verify code and secure your account</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[13px] font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Account Email</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-primary">
                <Mail size={18} className="text-gray-400 group-focus-within:text-primary" />
              </div>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="you@example.com" 
                className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium transition-all"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Verification Code</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-primary">
                <ShieldCheck size={18} className="text-gray-400 group-focus-within:text-primary" />
              </div>
              <Input 
                id="otp" 
                value={formData.otp} 
                onChange={handleChange} 
                placeholder="6-digit code" 
                className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-black tracking-[0.2em] transition-all"
                maxLength={6}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">New Secure Password</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-primary">
                <Lock size={18} className="text-gray-400 group-focus-within:text-primary" />
              </div>
              <Input 
                id="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium transition-all"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-primary">
                <Lock size={18} className="text-gray-400 group-focus-within:text-primary" />
              </div>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium transition-all"
                required 
              />
            </div>
          </div>

          <AnimatedButton 
            type="submit" 
            variant="ripple" 
            size="lg" 
            className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20" 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </AnimatedButton>
        </form>

        <div className="mt-8 flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
          <NextLink className="text-primary hover:underline hover:text-primary/80 transition-colors" href="/forgot-password">
            Resend Code
          </NextLink>
          <NextLink className="text-gray-400 hover:underline hover:text-gray-600 transition-colors" href="/signin">
            Back to sign in
          </NextLink>
        </div>
      </motion.div>
    </div>
  );
}