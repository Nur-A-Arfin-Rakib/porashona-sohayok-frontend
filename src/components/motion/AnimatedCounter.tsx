"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  toBengaliDigits?: boolean;
}

const enToBn = (num: number) => {
  const map: Record<string, string> = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return Math.round(num)
    .toString()
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
};

export default function AnimatedCounter({ value, suffix = "", prefix = "", className, toBengaliDigits = true }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {toBengaliDigits ? enToBn(display) : Math.round(display)}
      {suffix}
    </motion.span>
  );
}
