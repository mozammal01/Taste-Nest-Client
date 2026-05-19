"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, Search, MessageCircle, X } from "lucide-react";

const faqs = [
  {
    question: "Do you offer vegan and gluten-free options?",
    answer: "Yes! We have a wide variety of vegan and gluten-free dishes. Look for the special icons on our menu or ask your server for recommendations.",
  },
  {
    question: "How can I make a reservation for a large group?",
    answer: "For groups larger than 8, please contact us directly via phone or use our reservation form and specify the group size. We'll do our best to accommodate your requested time.",
  },
  {
    question: "Is there a parking facility available at TasteNest?",
    answer: "Yes, we offer complimentary valet parking for all our guests. There is also public parking available nearby.",
  },
  {
    question: "Can I host private events or parties at the restaurant?",
    answer: "Absolutely! TasteNest has dedicated private dining spaces perfect for corporate events, birthdays, and celebrations. Contact our events team for customized menus.",
  },
  {
    question: "What are your delivery hours?",
    answer: "Our delivery service operates from 11:00 AM to 10:30 PM daily. You can order through our website or mobile app for real-time tracking.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 bg-background dark:bg-slate-950 relative overflow-hidden transition-colors">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
              Curious About <span className="text-primary italic">TasteNest?</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
              Everything you need to know about our culinary experience, reservations, and services.
            </p>

            {/* Interactive FAQ Search Filter */}
            <div className="max-w-md mx-auto pt-6 relative">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 group focus-within:bg-white dark:focus-within:bg-slate-900/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Have a question? Search here..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpenIndex(0); // Open the first item upon search
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm font-semibold"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredFaqs.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col justify-center items-center py-12 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-800">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2">No matching questions found</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-sm">
                  We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Ask our smart AI Assistant at the bottom right corner for immediate support!
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="faq-list"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        transition: { type: "spring", bounce: 0.3 } 
                      }
                    }}
                    className={`rounded-[24px] border-2 transition-all duration-300 overflow-hidden ${
                      openIndex === index 
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                    >
                      <span className={`text-lg md:text-xl font-bold transition-colors ${
                        openIndex === index ? "text-primary" : "text-slate-800 dark:text-slate-200 group-hover:text-primary"
                      }`}>
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        openIndex === index 
                          ? "bg-primary text-white rotate-180" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary"
                      }`}>
                        {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 md:px-8 pb-8 pt-0 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
