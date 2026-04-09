"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedButton } from "@/components/ui/animated-button";
import logo from "@/../public/logo/logo.png";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { z } from "zod";
import { loginSchema } from "@/zod/auth.schema";
import { toast } from "sonner";
import { useEffect } from "react";
import { User, ShieldCheck, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function SigninLeftSide() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.info(message);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);
      const result = await signIn.email({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (result?.error) {
        const errorMessage = result.error.message || "Invalid credentials";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success("Welcome back! Happy dining.");
        const callbackUrl = searchParams.get("callbackUrl") || "/";
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (err as any).errors[0].message;
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = "Something went wrong. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Social Sign In
  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      const callbackParam = searchParams.get("callbackUrl") || "/";
      const finalCallbackURL = callbackParam.startsWith("http") 
        ? callbackParam 
        : `${window.location.origin}${callbackParam.startsWith("/") ? "" : "/"}${callbackParam}`;

      await signIn.social({
        provider,
        callbackURL: finalCallbackURL,
      });
    } catch (err) {
      console.error(`${provider} sign in error:`, err);
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  const handleDemoLogin = async (role: "user" | "admin") => {
    setIsLoading(true);
    const credentials = {
      user: { email: "user@tastenest.com", password: "Password123!" },
      admin: { email: "admin@tastenest.com", password: "Password123!" }
    };

    const demoData = credentials[role];
    setFormData(demoData);

    try {
      const result = await signIn.email({
        email: demoData.email,
        password: demoData.password,
      });

      if (result?.error) {
        toast.error(result.error.message || "Demo login failed");
      } else {
        toast.success(`Logged in as Demo ${role === "admin" ? "Admin" : "User"}`);
        router.push(searchParams.get("callbackUrl") || (role === "admin" ? "/admin" : "/"));
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during demo login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-linear-to-br from-white to-gray-50">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <Image src={logo} alt="TasteNest Logo" width={120} height={40} />
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Social Login */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:border-primary/50 hover:shadow-md group"
          >
            <GoogleIcon />

            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn("facebook")}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:border-blue-500/50 hover:shadow-md group"
          >
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-linear-to-br from-white to-gray-50 text-gray-500">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-12 h-14 rounded-2xl border-gray-200 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <AnimatedButton type="submit" variant="ripple" size="lg" className="w-full h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl shadow-primary/30" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </AnimatedButton>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quick Access</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin("user")}
              disabled={isLoading}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-primary/10 transition-colors">
                <User className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-900 leading-tight">Demo User</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Login</p>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin("admin")}
              disabled={isLoading}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-amber-100 transition-colors">
                <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-900 leading-tight">Demo Admin</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dashboard View</p>
              </div>
            </button>
          </div>
        </div>

        {/* Secure Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Your data is protected with 256-bit SSL encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
