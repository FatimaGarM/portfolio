"use client";

import { MotionConfig } from "framer-motion";

// Con reducedMotion="user" Framer Motion respeta prefers-reduced-motion:
// quita desplazamientos y escalas y deja solo la opacidad.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
