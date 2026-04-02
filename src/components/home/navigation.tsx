"use client";

import logo from "../../../public/logo/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import UserMenu from "../auth/UserMenu";
import { getCartItemCount } from "@/lib/actions/cart";
import { useSession } from "@/lib/auth-client";
import { ShoppingCart, Search, X, Menu, ChevronRight, Phone, MapPin, Clock, Loader2, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/types/menuItems";
import { getMenuItems } from "@/lib/actions/menu";

export default function Navigation() {
  const ref = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    setIsScrolled(latest > 50);
  });

  // Fetch all menu items when search is opened
  useEffect(() => {
    if (isSearchOpen && allMenuItems.length === 0) {
      const fetchItems = async () => {
        setIsSearching(true);
        try {
          const items = await getMenuItems();
          setAllMenuItems(items);
        } catch (error) {
          console.error("Failed to fetch search items:", error);
        } finally {
          setIsSearching(false);
        }
      };
      fetchItems();
    }
  }, [isSearchOpen, allMenuItems.length]);

  // Handle Search Filtering with Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredResults([]);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = allMenuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      );
      setFilteredResults(filtered.slice(0, 6)); // Show top 6 results
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allMenuItems]);

  // Handle Esc to close search
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCartCount = async () => {
      const count = await getCartItemCount();
      if (isMounted) {
        setCartItemCount(count);
      }
    };

    fetchCartCount();

    // Refresh cart count periodically
    const interval = setInterval(fetchCartCount, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  const navItems = [
    { id: "home", label: "Home", href: "/", isSection: false },
    { id: "about", label: "About", href: "about", isSection: true },
    { id: "menu", label: "Menu", href: "menu", isSection: true },
    { id: "experts", label: "Experts", href: "experts", isSection: true },
    { id: "news", label: "Blogs", href: "news", isSection: true },
    { id: "contact", label: "Contact", href: "contact", isSection: true },
  ];

  const [activeSection, setActiveSection] = useState("home");

  // Scroll spy - detect which section is in view
  useEffect(() => {
    // Only run scroll spy on home page
    if (pathname !== "/") return;

    const sectionIds = ["about", "menu", "experts", "news", "contact"];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is 20% from top
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also detect when user is at the top of the page (home)
    const handleScroll = () => {
      if (window.scrollY < 300) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  interface NavItem {
    id: string;
    label: string;
    href: string;
    isSection: boolean;
  }

  // Handle smooth scroll to sections
  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.isSection) {
      e.preventDefault();
      setActiveSection(item.id);

      if (pathname !== "/") {
        // If not on home page, navigate to home first then scroll
        router.push(`/#${item.href}`);
      } else {
        // If on home page, scroll to section with a small delay for mobile menu to close
        setTimeout(() => {
          const element = document.getElementById(item.href);
          if (element) {
            const offset = 80; // Offset for the fixed header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    } else {
      setActiveSection(item.id);
    }

    setIsMobileMenuOpen(false);
  };

  const isActive = (item: NavItem) => {
    // If on /menu page, activate the "menu" nav item
    if (pathname === "/menu" && item.id === "menu") return true;
    if (item.href === "/") return pathname === "/" && activeSection === "home";
    if (item.isSection) return activeSection === item.id && pathname === "/";
    return pathname.startsWith(item.href);
  };

  const getHref = (item: NavItem) => {
    if (item.isSection) {
      return pathname === "/" ? `#${item.href}` : `/#${item.href}`;
    }
    return item.href;
  };

  const handleResultClick = (itemName: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/menu?search=${itemName.toLowerCase()}`);
  };

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "w-full bg-primary text-white text-sm py-2 fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "opacity-0 -translate-y-full" : "opacity-100",
        )}
      >
        <div className="max-w-[1500px] mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>123 Food Street, NYC</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mx-auto md:mx-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Open: Mon - Sun, 9:00 AM - 11:00 PM</span>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav
        ref={ref}
        initial={{ y: -100 }}
        animate={{
          y: 0,
          top: isScrolled ? 0 : 32,
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(4px)",
          boxShadow: isScrolled
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="w-full fixed left-0 right-0 z-[60]"
      >
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Image
                  src={logo}
                  alt="TasteNest"
                  width={isScrolled ? 80 : 100}
                  height={isScrolled ? 80 : 100}
                  className="transition-all duration-300"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="flex items-center gap-1 bg-white/50 backdrop-blur-md rounded-full p-1.5 border border-slate-200/50 shadow-sm">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={getHref(item)}
                  onClick={(e) => handleNavClick(item, e)}
                  scroll={!item.isSection}
                >
                  <motion.div
                    className={cn(
                      "relative px-6 py-2.5 rounded-full text-[14px] font-black uppercase tracking-widest transition-all duration-300 overflow-hidden",
                      isActive(item) ? "text-white" : "text-slate-600 hover:text-primary",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Background for active state */}
                    {isActive(item) && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-linear-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </motion.button>

              {/* Cart */}
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <AnimatePresence mode="wait">
                    {cartItemCount > 0 && (
                      <motion.span
                        key={cartItemCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                      >
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-200" />

              {/* User Menu */}
              <UserMenu onLinkClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>

          {/* Mobile/Tablet Navigation */}
          <div className="lg:hidden flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/">
              <Image src={logo} alt="TasteNest" width={70} height={70} />
            </Link>

            {/* Mobile Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </motion.button>

              {/* Cart */}
              <Link href="/cart">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="max-w-[1500px] mx-auto px-4 py-4">
                {/* Mobile Nav Items */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={getHref(item)}
                        onClick={(e) => handleNavClick(item, e)}
                        scroll={!item.isSection}
                        className={cn(
                          "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group",
                          isActive(item)
                            ? "bg-linear-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
                            : "text-gray-700 hover:bg-gray-100 hover:pl-6",
                        )}
                      >
                        <span className="text-base font-medium">{item.label}</span>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 transition-all duration-300",
                            isActive(item)
                              ? "text-white translate-x-1"
                              : "text-gray-400 group-hover:text-primary group-hover:translate-x-1",
                          )}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile User Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <UserMenu onLinkClick={() => setIsMobileMenuOpen(false)} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-start justify-center pt-20 md:pt-32 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-3xl rounded-[32px] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Area */}
              <div className="p-8 border-b border-slate-50">
                <div className="flex items-center gap-6 bg-slate-50 rounded-2xl px-6 py-5 group focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-500">
                  <Search className={cn("w-6 h-6 transition-colors duration-500", searchQuery ? "text-primary" : "text-slate-400")} />
                  <input
                    type="text"
                    placeholder="Search for dishes, flavors, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                    autoFocus
                  />
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results Area */}
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                {searchQuery.trim() === "" ? (
                  <div className="p-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                      Popular Collections
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["Cappuccino", "Double Beef Burger", "Espresso", "Juicy Steaks", "Caramel Pudding", "Vanilla Ice Cream", "Grilled Ribeye Steak"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-5 py-2.5 bg-slate-50 hover:bg-primary hover:text-white rounded-full text-sm font-bold text-slate-600 transition-all duration-300 active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 gap-2">
                    {filteredResults.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <button
                          onClick={() => handleResultClick(item.name)}
                          className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 transition-all rounded-2xl group"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                             <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</h4>
                            <p className="text-xs text-slate-500 font-medium line-clamp-1">{item.content}</p>
                            <span className="mt-1 text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md inline-block">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-slate-900">${item.price}</p>
                             <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      </motion.div>
                    ))}
                    <div className="p-4 mt-2 border-t border-slate-50 flex justify-center">
                      <button 
                        onClick={() => handleResultClick(searchQuery)}
                        className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:underline"
                      >
                        View All Results for &quot;{searchQuery}&quot;
                      </button>
                    </div>
                  </div>
                ) : !isSearching && (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                      <UtensilsCrossed className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No flavors found</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto">
                      We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try generic terms like &quot;Pizza&quot; or &quot;Drink&quot;.
                    </p>
                  </div>
                )}
              </div>

              {/* Keyboard Shortcut Hint */}
              <div className="px-8 py-5 bg-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded-md border border-slate-200 text-[10px]">ESC</kbd>
                    Close
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white rounded-md border border-slate-200 text-[10px]">↵</kbd>
                    Search
                  </span>
                </div>
                <span>TasteNest Explorer</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav to prevent content jump */}
      <motion.div
        animate={{
          height: isScrolled ? 76 : 110,
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </>
  );
}
