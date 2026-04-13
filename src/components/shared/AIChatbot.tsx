"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAIChatResponse } from "@/lib/actions/ai";

// Mock FAQ data as fallback
const faqData = [
  { question: "What are your opening hours?", answer: "We are open Monday to Friday from 9:00 AM to 11:00 PM. On weekends, we open at 10:00 AM and close at midnight." },
  { question: "Where is TasteNest located?", answer: "Our signature restaurant is located at 123 Gourmet Street, Food City. We also have express outlets across the metropolitan area." },
  { question: "Do I need to make a reservation?", answer: "Reservations are not required but highly recommended for dinner and weekends. You can book a table directly from our homepage or call us at +1 234 567 890." },
  { question: "How long does delivery usually take?", answer: "Our elite delivery fleet typically reaches you within 20-35 minutes. You can track your rider in real-time from your 'Orders' dashboard." },
  { question: "Do you have gluten-free or vegan options?", answer: "Yes! We take dietary needs seriously. Look for the 'GF' (Gluten-Free) and 'V' (Vegan) tags on our menu. Our 'Green Earth' burger is a fan-favorite vegan choice." },
  { question: "What is on the menu?", answer: "We specialize in Artisan Flavors, including Prime Ribeye Steaks, Gourmet Wagyu Burgers, Traditional Italian Pasta, and Hand-crafted Desserts like our signature Lava Cake." },
  { question: "Who is the Chef?", answer: "Our kitchen is led by Executive Chef Marco Rossi, who brings 20 years of experience from Michelin-starred kitchens to every TasteNest dish." },
  { question: "Is there a loyalty or rewards program?", answer: "Absolutely! Our TasteNest Rewards program allows you to earn points on every order. You can redeem these points for free meals and exclusive discounts from your 'Rewards' page." },
  { question: "How can I contact support?", answer: "You can reach our concierge team 24/7 at support@tastenest.com or via the 'Contact' page on our website." },
  { question: "Is the food organic?", answer: "We source 90% of our ingredients from certified local organic farms to ensure every bite is fresh and sustainable." },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your TasteNest Assistant. How can I help you with your culinary journey today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!mounted) return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Try to get a real AI response
      const aiResponse = await getAIChatResponse(input);
      
      let responseContent = "";

      if (aiResponse.error) {
        // 2. Fallback to mock logic if AI is not configured or fails
        console.warn("AI Fallback active:", aiResponse.error);
        
        const lowerInput = input.toLowerCase();
        const match = faqData.find(faq => 
          lowerInput.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
          faq.question.toLowerCase().split(' ').some(word => word.length > 4 && lowerInput.includes(word))
        );

        if (match) {
          responseContent = match.answer;
        } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
          responseContent = "Hello! Looking for something delicious today?";
        } else {
          responseContent = "I'm still learning about that. Would you like to check our help center or speak with our team?";
        }
      } else {
        responseContent = aiResponse.content || "I'm sorry, I couldn't process that.";
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] md:h-[600px] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">TasteNest AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex w-full mb-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px]",
                      msg.role === "user" ? "bg-primary text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500"
                    )}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm font-medium shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-800"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex gap-3 max-w-[85%] items-center">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-1 items-center h-10">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Tags Area - Now Wrap instead of Scroll */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex flex-wrap gap-2">
              {["Reserve Table", "Delivery Time", "Menu Items", "Vegan Options"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setInput(tag);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative group/input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your culinary query..."
                  className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-5 pr-14 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute inset-y-2 right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 group-hover/input:shadow-primary/40"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-4 text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60">
                Experience TasteNest Intelligence
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group relative",
          isOpen ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90" : "bg-primary text-white"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageCircle className="w-7 h-7" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-primary" 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hover Label */}
        {!isOpen && (
          <div className="absolute right-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-xl">
            Chat with AI
          </div>
        )}
      </motion.button>
    </div>
  );
}
