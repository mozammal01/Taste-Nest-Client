"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e2e8f0",
          padding: "14px 20px",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          fontFamily: "var(--font-outfit), sans-serif",
          color: "#0f172a",
        },
        className: "font-outfit",
        classNames: {
          toast: "group !bg-white !border-slate-200 !shadow-xl flex items-center gap-4",
          success: "!text-emerald-700 !bg-white !ring-1 !ring-emerald-500/20",
          error: "!text-rose-700 !bg-white !ring-1 !ring-rose-500/20",
          info: "!text-sky-700 !bg-white !ring-1 !ring-sky-500/20",
          title: "text-[14px] font-black tracking-tight",
          description: "text-[12px] text-slate-500 font-bold",
          actionButton: "!bg-slate-900 !text-white !rounded-full !px-4 !py-2 !text-[11px] !font-black !uppercase !tracking-widest !transition-all hover:!bg-slate-800 active:!scale-95 !shadow-lg !shadow-slate-200",
          closeButton: "hover:bg-slate-100 transition-all text-slate-400 opacity-0 group-hover:opacity-100",
        },
      }}
      richColors={false}
      closeButton
      duration={4000}
      visibleToasts={3}
    />
  );
}
