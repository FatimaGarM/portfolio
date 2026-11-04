"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CloseIcon, MenuIcon } from "@/components/icons";

type NavLink = { href: string; label: string };

export default function Nav({ name, links }: { name: string; links: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // La animación de cierre del menú corta el scroll suave del navegador,
  // así que se espera a que termine antes de desplazar.
  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    window.history.pushState(null, "", href);
    window.setTimeout(() => target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), reduce ? 0 : 380);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav" data-scrolled={scrolled || open}>
      <nav className="contenedor nav-interior" aria-label="Principal">
        <a href="#inicio" className="nav-marca">
          {name}
        </a>

        <ul className="nav-enlaces">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-boton"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          {open ? "Cerrar" : "Menú"}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="menu-movil"
            className="nav-movil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul className="contenedor">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(event) => goTo(event, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
