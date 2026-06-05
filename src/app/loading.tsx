"use client";

import NextImage from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <div className="relative w-24 h-24">
          <NextImage
            src="/waeclogo.png"
            alt="WAEC Prep Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Spinner */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-indigo-600" />
          </motion.div>
          
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            Loading WAEC Prep...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
