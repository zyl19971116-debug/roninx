"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePlayerStore } from "@/store/playerStore";

export function Toasts() {
  const toasts = usePlayerStore((state) => state.toasts);
  return <div className="toast-stack"><AnimatePresence>{toasts.map((toast) => <motion.div className="toast" key={toast.id} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}><i/> {toast.message}</motion.div>)}</AnimatePresence></div>;
}
