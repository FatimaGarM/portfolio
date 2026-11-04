"use client";

import { useState } from "react";
import { MailIcon } from "@/components/icons";

type Props = {
  email: string;
};

export default function CopyEmail({ email }: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="contacto-email"
      title="Copiar correo"
      style={{
        position: "relative",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        fontWeight: "inherit",
        lineHeight: "inherit",
      }}
    >
      <MailIcon size={22} className="contacto-email-icono" />
      {email}
      <span
        aria-live="polite"
        style={{
          position: "absolute",
          left: "50%",
          top: "100%",
          transform: "translateX(-50%)",
          marginTop: "0.5rem",
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          color: "var(--oro-rosa)",
        }}
      >
        {copiado ? "Correo copiado" : ""}
      </span>
    </button>
  );
}
