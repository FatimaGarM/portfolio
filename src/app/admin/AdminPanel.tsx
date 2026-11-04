"use client";

import { ChangeEvent, useState } from "react";
import type { PortfolioContent, Project, Section, SkillGroup, TimelineItem } from "@/lib/schema";
import { DownIcon, UpIcon } from "@/components/icons";

type Tab = "perfil" | "secciones" | "proyectos" | "experiencia" | "formacion" | "tecnologias" | "contacto" | "versiones";

const tabs: { id: Tab; label: string }[] = [
  { id: "perfil", label: "Perfil" },
  { id: "secciones", label: "Títulos de secciones" },
  { id: "proyectos", label: "Proyectos" },
  { id: "experiencia", label: "Experiencia" },
  { id: "formacion", label: "Formación" },
  { id: "tecnologias", label: "Tecnologías" },
  { id: "contacto", label: "Contacto" },
  { id: "versiones", label: "Versiones anteriores" },
];

const newProject = (): Project => ({
  id: crypto.randomUUID(),
  name: "Nuevo proyecto",
  description: "Descripción del proyecto",
  image: "",
  multimedia: "",
  url: "",
  repo: "",
  year: String(new Date().getFullYear()),
  tags: [],
  collaborators: [],
  badge: "",
  problem: "",
  solution: "",
  featured: false,
  published: false,
});

const newTimelineItem = (): TimelineItem => ({
  id: crypto.randomUUID(),
  period: "Periodo",
  title: "Título",
  place: "",
  description: "",
  badge: "",
  tags: [],
  published: false,
});

const newSkillGroup = (): SkillGroup => ({ id: crypto.randomUUID(), label: "Nuevo grupo", skills: [] });

const toList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

/* Campos reutilizables */
function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) {
  return (
    <label className="admin-campo">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Area({ label, value, onChange, rows = 4, hint }: { label: string; value: string; onChange: (value: string) => void; rows?: number; hint?: string }) {
  return (
    <label className="admin-campo admin-ancho">
      {label}
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  const [draft, setDraft] = useState(value.join(", "));
  return (
    <label className="admin-campo admin-ancho">
      {label}
      <input
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          onChange(toList(event.target.value));
        }}
      />
      <small>Separadas por comas</small>
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="admin-check">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function ItemActions({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <div className="admin-acciones">
      <button type="button" className="admin-boton-sec" disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="Subir">
        <UpIcon />
      </button>
      <button type="button" className="admin-boton-sec" disabled={index === total - 1} onClick={() => onMove(index + 1)} aria-label="Bajar">
        <DownIcon />
      </button>
      <button
        type="button"
        className="admin-boton-sec admin-peligro"
        onClick={() => {
          if (window.confirm("¿Quitar este elemento? Podrás recuperarlo desde Versiones anteriores después de guardar.")) onRemove();
        }}
      >
        Quitar
      </button>
    </div>
  );
}

function move<T>(list: T[], from: number, to: number) {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/* Panel */
export default function AdminPanel({ initialContent }: { initialContent: PortfolioContent }) {
  const [content, setContent] = useState<PortfolioContent>(initialContent);
  const [tab, setTab] = useState<Tab>("perfil");
  const [status, setStatus] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [revisions, setRevisions] = useState<string[] | null>(null);

  const update = (patch: Partial<PortfolioContent>) => {
    setContent((current) => ({ ...current, ...patch }));
    setDirty(true);
  };
  const updateSite = (patch: Partial<PortfolioContent["site"]>) => update({ site: { ...content.site, ...patch } });
  const updateSection = (key: keyof PortfolioContent["sections"], patch: Partial<Section>) =>
    update({ sections: { ...content.sections, [key]: { ...content.sections[key], ...patch } } });

  function updateAt<K extends "projects" | "experience" | "education" | "skillGroups">(key: K, index: number, patch: Partial<PortfolioContent[K][number]>) {
    const list = content[key].map((item, i) => (i === index ? { ...item, ...patch } : item));
    update({ [key]: list } as Partial<PortfolioContent>);
  }

  async function save() {
    setSaving(true);
    setStatus("Guardando…");
    setIssues([]);
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    const data = (await response.json().catch(() => ({}))) as { message?: string; issues?: string[]; content?: PortfolioContent };
    if (response.status === 401) {
      setStatus("La sesión ha caducado. Vuelve a iniciar sesión (tus cambios siguen aquí).");
      return;
    }
    if (!response.ok) {
      setStatus(data.message || "No se pudo guardar");
      setIssues(data.issues || []);
      return;
    }
    if (data.content) setContent(data.content);
    setDirty(false);
    setRevisions(null);
    setStatus("Cambios guardados. Ya se ven en el portfolio.");
  }

  async function logout() {
    if (dirty && !window.confirm("Tienes cambios sin guardar. ¿Salir igualmente?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  async function loadRevisions() {
    const response = await fetch("/api/admin/revisions");
    const data = (await response.json().catch(() => ({}))) as { revisions?: string[] };
    setRevisions(data.revisions || []);
  }

  async function restore(file: string) {
    if (!window.confirm("¿Volver a esta versión? La actual se guardará como una versión más.")) return;
    const response = await fetch("/api/admin/revisions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ file }),
    });
    const data = (await response.json().catch(() => ({}))) as { content?: PortfolioContent; message?: string };
    if (response.ok && data.content) {
      setContent(data.content);
      setDirty(false);
      setRevisions(null);
      setStatus("Versión recuperada.");
    } else {
      setStatus(data.message || "No se pudo recuperar la versión");
    }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setStatus(`Subiendo ${file.name}…`);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
    if (!response.ok || !data.url) {
      setStatus(data.message || "No se pudo subir el archivo");
      return;
    }
    onUploaded(data.url);
    setStatus("Archivo subido. Recuerda guardar.");
  }

  const formatRevision = (file: string) => {
    const iso = file.replace(".json", "").replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? file : date.toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" });
  };

  return (
    <main className="admin">
      <header className="admin-cabecera">
        <div>
          <a href="/" className="enlace" style={{ fontSize: "0.875rem" }}>
            Ver el portfolio
          </a>
          <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 2.6rem)", marginTop: "0.4rem" }}>Panel del portfolio</h1>
        </div>
        <div className="admin-acciones">
          <button type="button" className="admin-boton-sec" onClick={logout}>
            Cerrar sesión
          </button>
          <button type="button" className="boton" onClick={save} disabled={saving || !dirty} style={{ border: 0, cursor: "pointer", opacity: saving || !dirty ? 0.6 : 1 }}>
            {saving ? "Guardando…" : dirty ? "Guardar cambios" : "Guardado"}
          </button>
        </div>
      </header>

      <p className="admin-estado" role="status">
        {status}
      </p>
      {issues.length > 0 && (
        <ul className="admin-errores" role="alert">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}

      <nav className="admin-pestanas" aria-label="Secciones del panel">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={tab === item.id ? "page" : undefined}
            onClick={() => {
              setTab(item.id);
              if (item.id === "versiones") loadRevisions();
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "perfil" && (
        <section className="admin-tarjeta">
          <Field label="Nombre" value={content.site.name} onChange={(name) => updateSite({ name })} />
          <Field label="Rol" value={content.site.role} onChange={(role) => updateSite({ role })} />
          <Field label="Disponibilidad" value={content.site.availability} onChange={(availability) => updateSite({ availability })} />
          <Field label="Ubicación" value={content.site.location} onChange={(location) => updateSite({ location })} />
          <Area label="Presentación" rows={7} value={content.site.introduction} onChange={(introduction) => updateSite({ introduction })} hint="Deja una línea en blanco para separar párrafos" />
          <ListField label="Etiquetas de la portada" value={content.site.heroTags} onChange={(heroTags) => updateSite({ heroTags })} />
          <Field label="Email" value={content.site.email} onChange={(email) => updateSite({ email })} />
          <Field label="CV (ruta o URL)" value={content.site.cvUrl} onChange={(cvUrl) => updateSite({ cvUrl })} />
          <Field label="GitHub" value={content.site.github} onChange={(github) => updateSite({ github })} />
          <Field label="LinkedIn" value={content.site.linkedin} onChange={(linkedin) => updateSite({ linkedin })} />
          <Field label="Título SEO" value={content.site.seoTitle} onChange={(seoTitle) => updateSite({ seoTitle })} hint="Máximo 70 caracteres" />
          <Field label="Imagen para redes (Open Graph)" value={content.site.ogImage} onChange={(ogImage) => updateSite({ ogImage })} />
          <Field label="Ilustración de la portada" value={content.site.illustration} onChange={(illustration) => updateSite({ illustration })} hint="Va dentro del círculo dorado (solo en escritorio)" />
          <label className="admin-campo">
            Subir ilustración
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => upload(event, (illustration) => updateSite({ illustration }))} />
          </label>
          <Area label="Descripción SEO" rows={3} value={content.site.seoDescription} onChange={(seoDescription) => updateSite({ seoDescription })} hint="Máximo 170 caracteres" />
        </section>
      )}

      {tab === "secciones" &&
        (["projects", "experience", "education", "skills"] as const).map((key) => (
          <section key={key} className="admin-tarjeta">
            <Field label="Antetítulo (también es el texto del menú)" value={content.sections[key].eyebrow} onChange={(eyebrow) => updateSection(key, { eyebrow })} />
            <Field label="Título" value={content.sections[key].title} onChange={(title) => updateSection(key, { title })} />
            <Area label="Introducción" rows={2} value={content.sections[key].intro} onChange={(intro) => updateSection(key, { intro })} />
          </section>
        ))}

      {tab === "proyectos" && (
        <>
          <button type="button" className="admin-boton-sec" onClick={() => update({ projects: [...content.projects, newProject()] })}>
            Añadir proyecto
          </button>
          {content.projects.map((project, index) => (
            <section key={project.id} className="admin-tarjeta">
              <div className="admin-ancho admin-fila">
                <h2 style={{ fontSize: "1.35rem" }}>{project.name || "Proyecto sin nombre"}</h2>
                <ItemActions
                  index={index}
                  total={content.projects.length}
                  onMove={(to) => update({ projects: move(content.projects, index, to) })}
                  onRemove={() => update({ projects: content.projects.filter((_, i) => i !== index) })}
                />
              </div>
              <div className="admin-ancho admin-fila" style={{ justifyContent: "flex-start", gap: "1.5rem" }}>
                <Check label="Publicado" checked={project.published} onChange={(published) => updateAt("projects", index, { published })} />
                <Check label="Destacado (ocupa todo el ancho)" checked={project.featured} onChange={(featured) => updateAt("projects", index, { featured })} />
              </div>
              <Field label="Nombre" value={project.name} onChange={(name) => updateAt("projects", index, { name })} />
              <Field label="Insignia" value={project.badge} onChange={(badge) => updateAt("projects", index, { badge })} hint="Ej.: Proyecto final DAW" />
              <Field label="Año" value={project.year} onChange={(year) => updateAt("projects", index, { year })} />
              <Field label="Enlace principal" value={project.url} onChange={(url) => updateAt("projects", index, { url })} hint="Web o repositorio" />
              <Field label="Repositorio (opcional)" value={project.repo} onChange={(repo) => updateAt("projects", index, { repo })} hint="Si lo dejas vacío y el enlace no es de GitHub, sale «Código privado»" />
              <Area label="Descripción" value={project.description} onChange={(description) => updateAt("projects", index, { description })} />
              <Area label="El reto (solo en destacados)" rows={2} value={project.problem} onChange={(problem) => updateAt("projects", index, { problem })} />
              <Area label="La solución (solo en destacados)" rows={2} value={project.solution} onChange={(solution) => updateAt("projects", index, { solution })} />
              <ListField label="Tecnologías" value={project.tags} onChange={(tags) => updateAt("projects", index, { tags })} />
              <ListField label="Colaboradores" value={project.collaborators} onChange={(collaborators) => updateAt("projects", index, { collaborators })} />
              <Field label="Imagen" value={project.image} onChange={(image) => updateAt("projects", index, { image })} />
              <label className="admin-campo">
                Subir imagen
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => upload(event, (image) => updateAt("projects", index, { image }))} />
              </label>
            </section>
          ))}
        </>
      )}

      {(tab === "experiencia" || tab === "formacion") &&
        (() => {
          const key = tab === "experiencia" ? "experience" : "education";
          const list = content[key];
          return (
            <>
              <button type="button" className="admin-boton-sec" onClick={() => update({ [key]: [...list, newTimelineItem()] } as Partial<PortfolioContent>)}>
                Añadir
              </button>
              {list.map((item, index) => (
                <section key={item.id} className="admin-tarjeta">
                  <div className="admin-ancho admin-fila">
                    <h2 style={{ fontSize: "1.35rem" }}>{item.title}</h2>
                    <ItemActions
                      index={index}
                      total={list.length}
                      onMove={(to) => update({ [key]: move(list, index, to) } as Partial<PortfolioContent>)}
                      onRemove={() => update({ [key]: list.filter((_, i) => i !== index) } as Partial<PortfolioContent>)}
                    />
                  </div>
                  <div className="admin-ancho">
                    <Check label="Publicado" checked={item.published} onChange={(published) => updateAt(key, index, { published })} />
                  </div>
                  <Field label="Periodo" value={item.period} onChange={(period) => updateAt(key, index, { period })} />
                  <Field label="Título" value={item.title} onChange={(title) => updateAt(key, index, { title })} />
                  <Field label="Lugar" value={item.place} onChange={(place) => updateAt(key, index, { place })} />
                  <Field label="Insignia" value={item.badge} onChange={(badge) => updateAt(key, index, { badge })} hint="Ej.: En curso" />
                  <Area label="Descripción" value={item.description} onChange={(description) => updateAt(key, index, { description })} />
                  <ListField label="Tecnologías" value={item.tags} onChange={(tags) => updateAt(key, index, { tags })} />
                </section>
              ))}
            </>
          );
        })()}

      {tab === "tecnologias" && (
        <>
          <button type="button" className="admin-boton-sec" onClick={() => update({ skillGroups: [...content.skillGroups, newSkillGroup()] })}>
            Añadir grupo
          </button>
          {content.skillGroups.map((group, index) => (
            <section key={group.id} className="admin-tarjeta">
              <div className="admin-ancho admin-fila">
                <h2 style={{ fontSize: "1.35rem" }}>{group.label}</h2>
                <ItemActions
                  index={index}
                  total={content.skillGroups.length}
                  onMove={(to) => update({ skillGroups: move(content.skillGroups, index, to) })}
                  onRemove={() => update({ skillGroups: content.skillGroups.filter((_, i) => i !== index) })}
                />
              </div>
              <Field label="Nombre del grupo" value={group.label} onChange={(label) => updateAt("skillGroups", index, { label })} />
              <ListField label="Tecnologías" value={group.skills} onChange={(skills) => updateAt("skillGroups", index, { skills })} />
            </section>
          ))}
        </>
      )}

      {tab === "contacto" && (
        <section className="admin-tarjeta">
          <Field label="Título" value={content.contact.title} onChange={(title) => update({ contact: { ...content.contact, title } })} />
          <Area label="Texto" value={content.contact.description} onChange={(description) => update({ contact: { ...content.contact, description } })} />
        </section>
      )}

      {tab === "versiones" && (
        <section className="admin-tarjeta">
          <p className="admin-ancho">Cada vez que guardas se queda una copia de la versión anterior (las 30 últimas).</p>
          {revisions === null && <p className="admin-ancho">Cargando…</p>}
          {revisions?.length === 0 && <p className="admin-ancho">Todavía no hay versiones guardadas.</p>}
          {revisions && revisions.length > 0 && (
            <ul className="admin-ancho admin-versiones">
              {revisions.map((file) => (
                <li key={file}>
                  <span>{formatRevision(file)}</span>
                  <button type="button" className="admin-boton-sec" onClick={() => restore(file)}>
                    Recuperar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
