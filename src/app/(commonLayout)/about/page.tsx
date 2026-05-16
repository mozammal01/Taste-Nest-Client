import Image from "next/image";
import { ShieldCheck, Award, Heart, Star } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | TasteNest",
  description: "Learn about the heritage, the chefs, and the culinary philosophy behind TasteNest.",
};

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
            alt="About TasteNest"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Our <span className="text-primary italic">Story</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            A decade of culinary excellence, artisan craftsmanship, and the pursuit of the perfect plate.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Philosophy</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                Where Tradition Meets <br />
                <span className="text-primary italic">Modern Artistry</span>
              </h3>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed italic">
              &quot;TasteNest was born from a simple desire: to create a sanctuary for food lovers where every dish is a masterpiece and every visit is a memory.&quot;
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white">10k+</p>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Happy Guests</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white">25+</p>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Master Chefs</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
             <Image 
               src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
               alt="Cooking" 
               fill 
               className="object-cover"
             />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Values</h2>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">Built on <span className="text-primary italic">Excellence</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, title: "Quality First", desc: "We source only the finest organic ingredients from local sustainable farms." },
              { icon: <Award className="w-8 h-8" />, title: "Artisan Craft", desc: "Every dish is handcrafted with precision and artistic flair by our experts." },
              { icon: <Heart className="w-8 h-8" />, title: "Guest Centric", desc: "Your experience is our priority. We treat every guest like family." }
            ].map((value, i) => (
              <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4">{value.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-4 mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Masterminds</h2>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Meet the <span className="text-primary italic">Chefs</span></h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { name: "Marco Pierre", role: "Executive Chef", img: "https://images.unsplash.com/photo-1583394238182-6f71f218a66f?q=80&w=1974&auto=format&fit=crop" },
             { name: "Gordon V.", role: "Pastry Master", img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1954&auto=format&fit=crop" },
             { name: "Elena Rojas", role: "Grill Specialist", img: "https://images.unsplash.com/photo-1600566752355-397921139bc1?q=80&w=1974&auto=format&fit=crop" },
             { name: "Hideo K.", role: "Sushi Artist", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" }
           ].map((chef, i) => (
             <div key={i} className="group cursor-pointer">
               <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden mb-6">
                 <Image src={chef.img} alt={chef.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{chef.name}</h4>
               <p className="text-xs font-black uppercase tracking-widest text-primary mt-1">{chef.role}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-24 bg-primary flex items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-8">
           <Star className="w-12 h-12 text-white/50 mx-auto animate-pulse" />
           <p className="text-3xl md:text-5xl font-black text-white italic tracking-tight leading-tight">
             &quot;In the heart of every great meal is a story waiting to be told.&quot;
           </p>
           <div className="h-px w-24 bg-white/30 mx-auto" />
           <p className="text-sm font-black uppercase tracking-[0.4em] text-white/60">Founded 2014</p>
        </div>
      </section>
    </div>
  );
}
