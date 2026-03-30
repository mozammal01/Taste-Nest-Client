import Link from 'next/link';
import { ChefHat, Hammer, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata = {
  title: "Under Construction | TasteNest",
  description: "Our special feature is currently being seasoned and will be served soon.",
};

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-0">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10 text-center space-y-12">
        {/* Animated Icon Container */}
        <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping opacity-50" />
            <div className="relative h-32 w-32 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-200">
                <ChefHat size={64} className="text-primary" />
                <div className="absolute bottom-1 right-2 h-10 w-10 bg-slate-50 border-2 border-white rounded-full flex items-center justify-center animate-bounce duration-1000 shadow-lg">
                    <Hammer size={18} className="text-primary" />
                </div>
            </div>
        </div>

        {/* Textual Content */}
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 mb-4 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-sm">
                <Sparkles size={14} className="text-primary fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Chef is refining the recipe</span>
            </div>
            
            <h1 className="text-5xl md:text-7.5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                Something <span className="text-primary italic">Exquisite</span> is Coming
            </h1>
            
            <p className="max-w-xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                We&apos;re seasoning this special feature to perfection. Our culinary team is working tirelessly to bring you an unparalleled dining experience. 
            </p>
        </div>

        {/* Newsletter / Notification Section */}
        <div className="max-w-md mx-auto bg-white/60 p-2 rounded-[24px] border border-white shadow-2xl shadow-slate-200/50 backdrop-blur-md flex items-center gap-2">
           <Input 
              placeholder="Enter your email to get notified..." 
              className="bg-transparent border-0 focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 h-10 text-sm pl-4 flex-1"
           />
           <Button className="bg-primary hover:bg-primary/90 text-white px-6 h-12 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 group whitespace-nowrap">
              <span className="hidden sm:inline mr-2">Notify Me</span>
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </Button>
        </div>

        {/* Back Button */}
        <div className="pt-8 flex flex-col items-center gap-6">
          <Link href="/">
            <Button variant="outline" className="bg-white text-slate-600 border-slate-100 hover:text-slate-900 px-8 py-6 rounded-2xl font-bold h-14 active:scale-95 transition-all group border-2 shadow-sm">
                <ArrowLeft size={20} className="mr-3 group-hover:-translate-x-2 transition-transform" />
                Return Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="h-0.5 w-8 bg-slate-200" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">TasteNest &bull; Private Reserve</p>
             <div className="h-0.5 w-8 bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
