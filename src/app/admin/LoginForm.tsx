import { GoogleIcon } from "@/components/icons";

const messages: Record<string, string> = {
  "no-autorizado": "Esa cuenta de Google no tiene acceso a este panel.",
  estado: "La sesión de inicio ha caducado o no es válida. Vuelve a intentarlo.",
  google: "Google no ha completado el inicio de sesión. Vuelve a intentarlo.",
  config: "Falta configurar el acceso con Google en .env.local (mira .env.example).",
};

export default function LoginForm({ error }: { error?: string }) {
  const message = error ? messages[error] || messages.google : "";

  return (
    <main className="admin-login">
      <div className="panel" style={{ width: "100%", maxWidth: "24rem", height: "auto", gap: "1.1rem" }}>
        <p className="antetitulo">Panel del portfolio</p>
        <h1 style={{ fontSize: "2rem" }}>Iniciar sesión</h1>
        <p style={{ color: "var(--canela)", fontSize: "0.95rem" }}>Solo se puede entrar con la cuenta de Google de la administradora.</p>
        {message && (
          <p role="alert" className="admin-errores" style={{ margin: 0, padding: "0.75rem 1rem" }}>
            {message}
          </p>
        )}
        <a href="/api/admin/login" className="boton" style={{ justifyContent: "center" }}>
          <GoogleIcon />
          Entrar con Google
        </a>
        <a href="/" className="enlace" style={{ alignSelf: "center", fontSize: "0.875rem" }}>
          Volver al portfolio
        </a>
      </div>
    </main>
  );
}
