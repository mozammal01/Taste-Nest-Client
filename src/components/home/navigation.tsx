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
import { ShoppingCart, Search, X, Menu, ChevronRight, Phone, MapPin, Clock } from "lucide-react";

export default function Navigation() {
  const ref = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCartCount = async () => {
      if (userId) {
        const count = await getCartItemCount(userId);
        if (isMounted) {
          setCartItemCount(count);
        }
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

  // Handle smooth scroll to sections
  const handleNavClick = (item: (typeof navItems)[0], e: React.MouseEvent) => {
    if (item.isSection) {
      e.preventDefault();
      setActiveSection(item.id);

      if (pathname !== "/") {
        // If not on home page, navigate to home first then scroll
        router.push(`/#${item.href}`);
      } else {
        // If on home page, just scroll to section
        const element = document.getElementById(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      setActiveSection(item.id);
    }

    setIsMobileMenuOpen(false);
  };

  const isActive = (item: (typeof navItems)[0]) => {
    // If on /menu page, activate the "menu" nav item
    if (pathname === "/menu" && item.id === "menu") return true;
    if (item.href === "/") return pathname === "/" && activeSection === "home";
    if (item.isSection) return activeSection === item.id && pathname === "/";
    return pathname.startsWith(item.href);
  };

  const getHref = (item: (typeof navItems)[0]) => {
    if (item.isSection) {
      return pathname === "/" ? `#${item.href}` : `/#${item.href}`;
    }
    return item.href;
  };

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "w-full bg-primary text-white text-sm py-2 fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "opacity-0 -translate-y-full" : "opacity-100"
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
        animate={{ y: 0 }}
        className={cn(
          "w-full fixed left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "top-0 bg-white/95 backdrop-blur-lg shadow-lg" : "top-8 bg-white/80 backdrop-blur-sm shadow-sm"
        )}
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
            <div className="flex items-center gap-1 bg-gray-50/80 rounded-full p-1.5">
              {navItems.map((item) => (
                <Link key={item.id} href={getHref(item)} onClick={(e) => handleNavClick(item, e)} scroll={!item.isSection}>
                  <motion.div
                    className={cn(
                      "relative px-5 py-2 rounded-full font-medium text-[15px] transition-all duration-300 overflow-hidden",
                      isActive(item) ? "text-white" : "text-gray-600 hover:text-gray-900"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background for active state */}
                    {isActive(item) && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-linear-to-r from-primary to-primary/80 rounded-full shadow-lg shadow-primary/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover background */}
                    {!isActive(item) && (
                      <motion.div
                        className="absolute inset-0 bg-gray-200/0 hover:bg-gray-200/50 rounded-full transition-colors duration-200"
                        whileHover={{ backgroundColor: "rgba(229, 231, 235, 0.5)" }}
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
              <UserMenu />
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
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
                <Search className="w-5 h-5 text-gray-600" />
              </motion.button>

              {/* Cart */}
              <Link href="/cart">
                <motion.div whileTap={{ scale: 0.9 }} className="relative p-2 rounded-full hover:bg-gray-100">
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
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
                            : "text-gray-700 hover:bg-gray-100 hover:pl-6"
                        )}
                      >
                        <span className="text-base font-medium">{item.label}</span>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 transition-all duration-300",
                            isActive(item) ? "text-white translate-x-1" : "text-gray-400 group-hover:text-primary group-hover:translate-x-1"
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
                  <UserMenu />
                </motion.div>

                {/* Mobile Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 pt-4 border-t border-gray-100 space-y-3"
                >
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Call us</p>
                      <p className="font-medium">+1 234 567 890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Opening hours</p>
                      <p className="font-medium">9:00 AM - 11:00 PM</p>
                    </div>
                  </div>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className="bg-white w-full max-w-2xl mx-auto mt-20 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for dishes, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-200 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Pizza", "Burger", "Pasta", "Desserts", "Drinks"].map((tag) => (
                    <Link
                      key={tag}
                      href={`/menu?search=${tag.toLowerCase()}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm text-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcut Hint */}
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between text-sm text-gray-400">
                <span>Press ESC to close</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs">↵</kbd>
                  <span>to search</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className={cn("transition-all duration-300", isScrolled ? "h-[72px]" : "h-[104px]")} />
    </>
  );
}
