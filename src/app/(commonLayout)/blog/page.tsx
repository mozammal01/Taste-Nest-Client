import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Search, Tag, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Culinary Journal | TasteNest Blog",
  description: "Explore the latest recipes, food trends, and culinary secrets from our master chefs.",
};

const blogs = [
  {
    id: 1,
    title: "The Art of Slow-Roasted Wagyu",
    excerpt: "Discover the patience and precision required to achieve the perfect tenderness in premium beef cuts.",
    category: "Techniques",
    author: "Chef Marco",
    date: "April 12, 2026",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "10 Ingredients Defining 2026",
    excerpt: "From fermented fungi to rare desert spices, here's what's dominating the global culinary scene.",
    category: "Trends",
    author: "Elena Rojas",
    date: "April 10, 2026",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "The Secret to Perfect Sicilian Sourdough",
    excerpt: "Our head baker reveals the 48-hour fermentation process behind our signature golden crust.",
    category: "Baking",
    author: "Gordon V.",
    date: "April 05, 2026",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop",
    readTime: "12 min read"
  },
  {
    id: 4,
    title: "Sustainable Sourcing in Modern Kitchens",
    excerpt: "How we bridge the gap between regional farms and metropolitan fine dining.",
    category: "Sustainability",
    author: "Management",
    date: "April 01, 2026",
    img: "https://images.unsplash.com/photo-1466632346940-99c4ee006d0b?q=80&w=2070&auto=format&fit=crop",
    readTime: "6 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Search Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Journal</h2>
                 <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                   Culinary <span className="text-primary italic">Journal</span>
                 </h1>
                 <p className="text-slate-500 font-medium max-w-sm">Diving deep into the culture, craftsmanship, and chemistry of fine dining.</p>
              </div>

              <div className="relative w-full md:w-96">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input 
                   type="text" 
                   placeholder="Search articles, techniques..." 
                   className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {blogs.map((blog) => (
             <article 
               key={blog.id} 
               className="group bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col"
             >
                <div className="relative h-72 w-full overflow-hidden">
                   <Image 
                     src={blog.img} 
                     alt={blog.title} 
                     fill 
                     className="object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                   <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                      {blog.category}
                   </div>
                </div>

                <div className="p-10 flex-1 space-y-6">
                   <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-2">
                         <Calendar size={14} className="text-primary" />
                         {blog.date}
                      </div>
                      <div className="flex items-center gap-2">
                         <User size={14} className="text-primary" />
                         {blog.author}
                      </div>
                   </div>

                   <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors group-hover:text-primary">
                     {blog.title}
                   </h3>

                   <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     {blog.excerpt}
                   </p>

                   <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                         <span className="flex items-center gap-1.5"><Tag size={12} /> {blog.readTime}</span>
                         <span className="flex items-center gap-1.5"><MessageCircle size={12} /> 12 Comments</span>
                      </div>
                      
                      <Link href={`/blog/${blog.id}`} className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 group/btn">
                         <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                </div>
             </article>
           ))}
        </div>

        {/* Categories Sidebar/Bottom */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
           {["All Stories", "Techniques", "Trends", "Recipes", "Interviews", "Sustainability"].map((cat, i) => (
             <button 
               key={i} 
               className={cn(
                 "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                 i === 0 ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:text-primary hover:border-primary/30"
               )}
             >
               {cat}
             </button>
           ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] -mr-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
           <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Newsletter</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">Stay in the Culinary Loop</h3>
              <p className="text-slate-400 max-w-xl mx-auto font-medium">Subscribe to receive exclusive recipes, kitchen hacks, and behind-the-scenes stories from TasteNest.</p>
           </div>
           
           <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your professional email" 
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold placeholder:text-white/30"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95">
                Subscribe
              </button>
           </form>
        </div>
      </section>
    </div>
  );
}

