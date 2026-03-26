"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedButton } from "@/components/ui/animated-button";
import logo from "@/../public/logo/logo.png";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function SigninLeftSide() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();

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
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error.message || "Invalid credentials");
      } else {
        // Successful login - redirect to home
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent("/")}`;
  };

  // Handle GitHub Sign In
  const handleGitHubSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-in/social?provider=github&callbackURL=${encodeURIComponent("/")}`;
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
            onClick={handleGoogleSignIn}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:border-primary/50 hover:shadow-md group"
          >
            <GoogleIcon />

            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Google</span>
          </button>
          <button
            type="button"
            onClick={handleGitHubSignIn}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:border-primary/50 hover:shadow-md group"
          >
            <GithubIcon />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">GitHub</span>
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary/20"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-primary focus:ring-primary/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
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
          <AnimatedButton type="submit" variant="ripple" size="lg" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </AnimatedButton>
        </form>

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
