"use client";

import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import logo from "@/../public/logo/logo.png";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: reqError } = await authClient.emailOtp.requestPasswordReset({
        email,
      });

      if (reqError) {
        setError(reqError.message || "Failed to send reset code.");
        toast.error(reqError.message || "Failed to send reset code.");
        return;
      }

      toast.success("Reset code sent to your email!");
      setIsSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
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
          <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 font-outfit">Check Your Inbox</h2>
          <p className="text-gray-500 font-medium mb-10">
            We&apos;ve sent a secure verification code to <br />
            <span className="text-slate-900 font-black italic">{email}</span>
          </p>
          <div className="space-y-4">
            <NextLink href="/reset-password">
              <AnimatedButton variant="ripple" className="w-full h-14 text-lg font-bold">
                Enter Code <ArrowRight className="ml-2 w-5 h-5" />
              </AnimatedButton>
            </NextLink>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
            >
              Wait, I used the wrong email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white to-gray-50 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 md:p-12 overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full -ml-12 -mb-12 blur-2xl" />

        <div className="relative z-10">
          <div className="flex justify-center mb-10">
             <NextLink href="/">
                <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                   <Image src={logo} alt="TasteNest Logo" width={140} height={45} />
                </motion.div>
             </NextLink>
          </div>

          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/10">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight font-outfit">Forgot Password?</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">Enter your email and we&apos;ll send a code</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-primary">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-primary" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
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
              {isLoading ? "Sending Code..." : "Request Reset Code"}
            </AnimatedButton>
          </form>

          <div className="mt-12 flex flex-col items-center gap-6">
            <NextLink className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all group" href="/signin">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to sign in
            </NextLink>
            
            <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex items-start gap-4">
               <HelpCircle className="w-5 h-5 text-primary shrink-0" />
               <p className="text-[11px] text-gray-500 font-medium leading-relaxed leading-[1.6]">
                  Haven&apos;t received the code? Check your spam folder or try again in a few minutes.
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
