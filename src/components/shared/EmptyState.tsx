"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  containerClassName?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  containerClassName,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 md:p-12 text-center",
      containerClassName
    )}>
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-16 border-2 border-dashed border-slate-200 dark:border-slate-800 max-w-2xl w-full",
        className
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl transform scale-150 animate-pulse" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 mx-auto">
              <Icon className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {action && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-4"
            >
              {action.onClick ? (
                <AnimatedButton 
                  variant="ripple" 
                  onClick={action.onClick}
                  className="font-black uppercase tracking-wider px-8"
                >
                  {action.label}
                </AnimatedButton>
              ) : action.href ? (
                <Link href={action.href}>
                  <AnimatedButton variant="ripple" className="font-black uppercase tracking-wider px-8">
                    {action.label}
                  </AnimatedButton>
                </Link>
              ) : null}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
