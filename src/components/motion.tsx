"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** Posición en la lista, para escalonar la entrada (90 ms por elemento) */
  index?: number;
  className?: string;
  as?: "div" | "li" | "article";
};

/** Entrada al hacer scroll: fundido y 16 px hacia arriba, solo la primera vez */
export function Reveal({ children, index = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduce ? 0.3 : 0.7, ease, delay: reduce ? 0 : index * 0.09 }}
    >
      {children}
    </Component>
  );
}

/** Línea bajo los títulos. Con movimiento reducido aparece ya dibujada. */
export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`linea-dorada ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease, delay: 0.15 }}
    />
  );
}
