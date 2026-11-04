import Image from "next/image";
import type { Project, Section } from "@/lib/schema";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";
import { ExternalIcon, GitHubIcon, LockIcon } from "@/components/icons";

function isGitHub(url: string) {
  return /^https?:\/\/(www\.)?github\.com\//i.test(url);
}

function ProjectLinks({ project }: { project: Project }) {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  const hasCode = Boolean(project.repo) || isGitHub(project.url);

  return (
    <div className="tarjeta-enlaces">
      {project.url && (
        <a href={project.url} className="enlace" {...external}>
          {isGitHub(project.url) ? <GitHubIcon size={16} /> : null}
          {isGitHub(project.url) ? "Ver en GitHub" : "Visitar la web"}
          {!isGitHub(project.url) && <ExternalIcon />}
          <span className="sr-only">: {project.name}</span>
        </a>
      )}
      {project.repo && (
        <a href={project.repo} className="enlace" {...external}>
          <GitHubIcon size={16} />
          Código
          <span className="sr-only"> de {project.name}</span>
        </a>
      )}
      {!hasCode && (
        <span className="tarjeta-privado" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <LockIcon size={14} />
          Código privado
        </span>
      )}
    </div>
  );
}

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  return (
    <Reveal as="li" index={index} className={featured ? "tarjeta-destacada-item" : undefined}>
      <article className={`tarjeta${featured ? " tarjeta-destacada" : ""}`} aria-labelledby={`proyecto-${project.id}`}>
        {project.image && (
          <div className="tarjeta-imagen" style={{ position: "relative" }}>
            <Image
              src={project.image}
              alt={`Captura de ${project.name}`}
              fill
              sizes={featured ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 45vw, 100vw"}
              priority={featured}
            />
          </div>
        )}

        <div className="tarjeta-cuerpo">
          <div className="tarjeta-meta">
            {project.badge ? <span className="insignia">{project.badge}</span> : <span />}
            {project.year && <span className="tarjeta-anio">{project.year}</span>}
          </div>

          <h3 id={`proyecto-${project.id}`} className="tarjeta-titulo">
            {project.name}
          </h3>

          <p className="tarjeta-texto">{project.description}</p>

          {featured && (project.problem || project.solution) && (
            <dl className="reto">
              {project.problem && (
                <div>
                  <dt>El reto</dt>
                  <dd>{project.problem}</dd>
                </div>
              )}
              {project.solution && (
                <div>
                  <dt>La solución</dt>
                  <dd>{project.solution}</dd>
                </div>
              )}
            </dl>
          )}

          {project.collaborators.length > 0 && (
            <p className="tarjeta-anio">Con {project.collaborators.join(", ")}</p>
          )}

          {project.tags.length > 0 && (
            <ul className="etiquetas" style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Tecnologías">
              {project.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <ProjectLinks project={project} />
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects({ section, projects }: { section: Section; projects: Project[] }) {
  const visible = projects.filter((project) => project.published);
  if (visible.length === 0) return null;

  return (
    <section id="proyectos" className="seccion" aria-labelledby="titulo-proyectos">
      <div className="contenedor">
        <SectionHeading section={section} id="titulo-proyectos" />
        <ul className="proyectos" style={{ listStyle: "none", padding: 0 }}>
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} featured={project.featured} />
          ))}
        </ul>
      </div>
    </section>
  );
}
