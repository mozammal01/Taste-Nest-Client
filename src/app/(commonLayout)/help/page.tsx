"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, LifeBuoy, BookOpen, CreditCard, Truck, Mail } from "lucide-react";
import SubTitle from "@/components/shared/subTitle";
import { cn } from "@/lib/utils";

const faqCategories = [
  { id: "general", label: "General", icon: LifeBuoy },
  { id: "orders", label: "Orders & Delivery", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "menu", label: "Menu & Dietary", icon: BookOpen },
];

const faqs = [
  {
    id: 1,
    category: "general",
    question: "What are your opening hours?",
    answer: "We are open Monday to Friday from 11:00 AM to 10:00 PM. On weekends, we open from 10:00 AM to 11:30 PM on Saturday and close at 9:00 PM on Sunday."
  },
  {
    id: 2,
    category: "general",
    question: "Do I need to make a reservation?",
    answer: "Reservations are not required but highly recommended, especially for dinners and weekends. You can easily book a table through our website's reservation system."
  },
  {
    id: 3,
    category: "orders",
    question: "How long does delivery usually take?",
    answer: "Standard delivery typically takes 30-45 minutes depending on your location and current kitchen order volume. You can track your order status in real-time via the dashboard."
  },
  {
    id: 4,
    category: "orders",
    question: "Can I modify my order after placing it?",
    answer: "Orders can only be modified within 5 minutes of placement before the kitchen begins preparation. Please contact customer support immediately for any urgent changes."
  },
  {
    id: 5,
    category: "payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, MasterCard, Amex), Stripe, PayPal, and Apple Pay/Google Pay via our secure checkout gateway."
  },
  {
    id: 6,
    category: "menu",
    question: "Do you have gluten-free or vegan options?",
    answer: "Absolutely. We are committed to catering to various dietary restrictions. Please look for the 'GF' (Gluten-Free) and 'V' (Vegan) tags on our menu items, or use our smart search to filter dishes."
  }
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery) return matchesSearch;
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
             <LifeBuoy className="w-8 h-8 text-blue-500" />
           </div>
           <SubTitle title="Help Center" />
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
             How can we assist you today? Search our knowledge base or browse categories below.
           </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 text-slate-900 dark:text-white text-lg font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all"
          />
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {faqCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm",
                    isActive 
                      ? "bg-primary text-white border-primary shadow-primary/25" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <span className="font-bold text-slate-900 dark:text-white text-lg pr-8">{faq.question}</span>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        isOpen ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      )}>
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-800/50 pt-4 mt-2 mx-2">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800"
              >
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
                <p className="text-slate-500">We couldn&apos;t find any answers matching &quot;{searchQuery}&quot;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-primary/5 rounded-[32px] p-8 border border-primary/10 text-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Still need help?</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">Our support team is always ready to answer your specific questions.</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
