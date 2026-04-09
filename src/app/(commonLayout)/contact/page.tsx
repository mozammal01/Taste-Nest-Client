"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import SubTitle from "@/components/shared/subTitle";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
           <SubTitle title="Get In Touch" />
           <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
             Have questions about our menu, want to book a private event, or just want to say hello? 
             We&apos;re here and ready to serve you.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
               <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 font-outfit tracking-tight">Contact <span className="text-primary italic">Details</span></h3>
               
               <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                     <MapPin className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white mb-1">Our Location</p>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">123 Culinary Avenue, Food District<br/>New York, NY 10001</p>
                   </div>
                 </div>

                 <div className="flex gap-4 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                     <Mail className="w-6 h-6 text-blue-500" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white mb-1">Email Us</p>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">contact@tastenest.com<br/>support@tastenest.com</p>
                   </div>
                 </div>

                 <div className="flex gap-4 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                     <Phone className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white mb-1">Call Us</p>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">+1 (555) 123-4567<br/>+1 (555) 987-6543</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Business Hours */}
            <div className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
               <h3 className="text-xl font-black mb-6 font-outfit relative z-10">Business Hours</h3>
               <div className="space-y-3 relative z-10 text-slate-300 text-sm font-medium">
                 <div className="flex justify-between border-b border-slate-700/50 pb-2">
                   <span>Monday - Friday</span>
                   <span className="text-white font-bold">11:00 AM - 10:00 PM</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-700/50 pb-2">
                   <span>Saturday</span>
                   <span className="text-white font-bold">10:00 AM - 11:30 PM</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-700/50 pb-2">
                   <span>Sunday</span>
                   <span className="text-primary font-bold">10:00 AM - 9:00 PM</span>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Send a Message</h3>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                />
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95">
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
