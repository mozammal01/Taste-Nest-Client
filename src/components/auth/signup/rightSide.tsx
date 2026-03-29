"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { signIn, signUp, emailOtp } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { AnimatedButton } from "@/components/ui/animated-button";
import logo from "@/../public/logo/logo.png";
import GoogleIcon from "@/components/icons/GoogleIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import { z } from "zod";
import { registerSchema } from "@/zod/auth.schema";
import { toast } from "sonner";
import { Mail, ShieldCheck, Loader2, ArrowRight, X } from "lucide-react";

export default function SignupRightSide() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const validatedData = registerSchema.parse({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const signUpResult = await signUp.email({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      });

      if (signUpResult?.error) {
        const errorMessage = signUpResult.error.message || "Registration failed";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Explicitly trigger OTP send after successful signup
      await emailOtp.sendVerificationOtp({
        email: formData.email,
        type: "email-verification",
      });

      // If signup is successful and email verification is enabled, 
      // better-auth-server will have sent an OTP.
      toast.success("Account created! Please verify your email.");
      setIsVerifying(true);
      
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    setError("");

    try {
      const result = await emailOtp.verifyEmail({
        email: formData.email,
        otp: otp,
      });

      if (result?.error) {
        setError(result.error.message || "Invalid verification code");
        toast.error(result.error.message || "Invalid verification code");
      } else {
        toast.success("Email verified successfully! Welcome aboard.");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      toast.error("Verification failed.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Social Sign In
  const handleSocialSignUp = async (provider: "google" | "github") => {
    try {
      await signIn.social({
        provider,
        callbackURL: window.location.origin,
      });
    } catch (err) {
      console.error(`${provider} sign up error:`, err);
      toast.error(`Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-linear-to-br from-gray-50 to-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {!isVerifying ? (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Logo */}
              <Link href="/" className="flex justify-center mb-8">
                <Image src={logo} alt="TasteNest Logo" width={120} height={40} />
              </Link>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-outfit">Create Account</h2>
                <p className="text-gray-600 font-medium italic opacity-70">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] font-bold"
                >
                  {error}
                </motion.div>
              )}

              {/* Social Login */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialSignUp("google")}
                  className="flex-1 flex items-center justify-center gap-3 py-3 px-3 border border-gray-200 bg-white rounded-xl hover:bg-slate-50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg active:scale-95"
                >
                  <GoogleIcon />
                  <span className="text-sm font-bold text-slate-700">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignUp("github")}
                  className="flex-1 flex items-center justify-center gap-3 py-3 px-3 border border-gray-200 bg-white rounded-xl hover:bg-slate-50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg active:scale-95"
                >
                  <GithubIcon />
                  <span className="text-sm font-bold text-slate-700">GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6 flex items-center gap-4">
                <div className="flex-1 border-t border-slate-100" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Registration</span>
                <div className="flex-1 border-t border-slate-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-slate-600 font-bold text-[13px] ml-1">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                       <svg className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="e.g. Mozammal Haq"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-11 h-12 bg-white rounded-xl border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-600 font-bold text-[13px] ml-1">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="hello@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-11 h-12 bg-white rounded-xl border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-slate-600 font-bold text-[13px] ml-1">
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                       <svg className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="+880"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-11 h-12 bg-white rounded-xl border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium"
                    />
                  </div>
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-slate-600 font-bold text-[13px] ml-1">Password</Label>
                      <div className="relative group">
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="h-12 bg-white rounded-xl border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium pr-10"
                            required
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">
                              {showPassword ? <X size={16} /> : <ShieldCheck size={16} />}
                          </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-600 font-bold text-[13px] ml-1">Confirm</Label>
                      <div className="relative group">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="h-12 bg-white rounded-xl border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-medium pr-10"
                            required
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">
                            {showConfirmPassword ? <X size={16} /> : <ShieldCheck size={16} />}
                          </button>
                      </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                  />
                  <Label htmlFor="terms" className="text-xs text-slate-500 font-bold cursor-pointer transition-colors hover:text-slate-900">
                    I agree to the <span className="text-primary hover:underline">Terms of Service</span>
                  </Label>
                </div>

                {/* Submit Button */}
                <AnimatedButton type="submit" variant="ripple" size="lg" className="w-full h-14 text-base font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/25" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {isLoading ? "Validating Account..." : "Create Account"}
                </AnimatedButton>
              </form>
            </motion.div>
          ) : (
            /* OTP Verification UI */
            <motion.div
              key="verification-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/5">
                      <Mail className="w-10 h-10 text-primary animate-bounce duration-2000" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Verify Your Email</h2>
                  <p className="text-slate-500 font-medium">
                     We've sent a 6-digit verification code to <br />
                     <span className="text-slate-900 font-black italic">{formData.email}</span>
                  </p>
                </div>

                {/* Error Message for OTP */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[13px] font-bold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Enter Verification Code</Label>
                        <Input
                          placeholder="e.g. 123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-[24px] border-slate-200 focus:border-primary focus:ring-primary/10 placeholder:tracking-normal placeholder:text-lg placeholder:font-bold"
                          maxLength={6}
                          required
                        />
                    </div>
                    
                    <AnimatedButton type="submit" variant="ripple" size="lg" className="w-full h-16 text-lg font-black uppercase tracking-[0.1em] shadow-2xl shadow-primary/30" disabled={isVerifyingOtp}>
                       {isVerifyingOtp ? <Loader2 className="animate-spin mr-2" /> : null}
                       {isVerifyingOtp ? "Verifying..." : "Confirm Identity"}
                       {!isVerifyingOtp && <ArrowRight className="ml-2 w-5 h-5" />}
                    </AnimatedButton>

                    <button 
                      type="button"
                      onClick={() => setIsVerifying(false)}
                      className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors font-outfit"
                    >
                      Back to Registration
                    </button>
                </form>

                <div className="text-center p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold mb-1">Didn't receive the code?</p>
                    <button className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline">Resend Verification Code</button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">
           &copy; 2026 TasteNest &bull; Secure Unified Auth System
        </p>
      </motion.div>
    </div>
  );
}
