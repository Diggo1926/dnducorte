"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "./motion";

export function StaggerList({
  children,
  className,
  as = "ul",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "tbody";
}) {
  const reduzirMovimento = useReducedMotion();

  if (reduzirMovimento) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Comp = as === "tbody" ? motion.tbody : motion.ul;
  return (
    <Comp initial="hidden" animate="visible" variants={staggerContainer} className={className}>
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "li",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "li" | "tr";
}) {
  const Comp = as === "tr" ? motion.tr : motion.li;
  return (
    <Comp variants={staggerItem} transition={{ duration: 0.25, ease: "easeOut" }} className={className}>
      {children}
    </Comp>
  );
}
