"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function BootScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setVisible(false), 1250); return () => clearTimeout(timer); }, []);
  return <AnimatePresence>{visible && <motion.div className="boot" exit={{ opacity: 0 }} transition={{ duration: .35 }}><div className="boot-brand">RONIN <b>X</b></div><small>INITIALIZING</small><div className="boot-line"><i/></div></motion.div>}</AnimatePresence>;
}
