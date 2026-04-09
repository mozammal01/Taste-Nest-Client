"use client";

import { ShieldCheck, Lock, Eye, Database, FileText } from "lucide-react";
import SubTitle from "@/components/shared/subTitle";

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 15, 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
             <ShieldCheck className="w-8 h-8 text-emerald-500" />
           </div>
           <SubTitle title="Privacy Policy" />
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
             Your privacy is critically important to us. This document outlines how we handle your data.
           </p>
           <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-400">
             Last Updated: <span className="text-primary">{lastUpdated}</span>
           </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm space-y-12">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">Information We Collect</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We collect information to provide better services to all our users. The types of personal information we collect include:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4 ml-4 font-medium">
              <li>Information you provide to us directly (e.g., account creation, reservation details).</li>
              <li>Information we get from your use of our services (e.g., order history, dining preferences).</li>
              <li>Device and log information (e.g., IP address, browser type) for security analytics.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">How We Use Information</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We use the information we collect from all our services for the following purposes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Service Delivery</span>
                <span className="text-slate-500 text-sm">To process your orders and handle reservations accurately.</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Personalization</span>
                <span className="text-slate-500 text-sm">To recommend menu items and exclusive VIP offers based on past orders.</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Communication</span>
                <span className="text-slate-500 text-sm">To send you updates, security alerts, and support messages.</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Security</span>
                <span className="text-slate-500 text-sm">To protect against fraudulent transactions and abuse of our systems.</span>
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">Data Protection</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We work hard to protect TasteNest and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. In particular:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4 ml-4 font-medium">
              <li>We encrypt many of our services using SSL.</li>
              <li>We review our information collection, storage, and processing practices.</li>
              <li>We restrict access to personal information to TasteNest employees, contractors, and agents who need that information in order to process it for us.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">Your Rights</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              You have the right to request a copy of your information, to object to our use of your information, to request the deletion or restriction of your information, or to request your information in a structured, electronic format. If you have any privacy-related questions, please <a href="/contact" className="text-primary hover:underline font-bold">contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
