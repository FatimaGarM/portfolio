import type { PortfolioContent } from "@/lib/schema";
import { GoldRule, Reveal } from "@/components/motion";
import Image from "next/image";
import { DownloadIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";

export default function Hero({ site }: { site: PortfolioContent["site"] }) {
  const paragraphs = site.introduction.split(/\n\s*\n/).filter(Boolean);
  // En móvil cada parte del rol va en su línea y el separador se oculta (ver .rol-sep)
  const roleParts = site.role.split(/\s*·\s*/).filter(Boolean);

  return (
    <section id="inicio" className="portada" aria-labelledby="titulo-portada">
      <span aria-hidden="true" className="anillo">
        {site.illustration && (
          <span className="anillo-imagen" style={{ position: "absolute" }}>
            <Image src={site.illustration} alt="" fill sizes="(min-width: 900px) 26vw, 0px" priority />
          </span>
        )}
      </span>
      <span aria-hidden="true" className="circulo circulo-1" />
      <span aria-hidden="true" className="circulo circulo-2" />
      <span aria-hidden="true" className="circulo circulo-3" />
      <span aria-hidden="true" className="punto" style={{ width: 6, height: 6, top: "22%", left: "58%", background: "rgba(201,149,108,0.45)" }} />
      <span aria-hidden="true" className="punto" style={{ width: 4, height: 4, top: "26%", left: "61%", background: "rgba(181,131,141,0.4)" }} />
      <span aria-hidden="true" className="punto" style={{ width: 5, height: 5, bottom: "18%", left: "8%", background: "rgba(227,199,155,0.6)" }} />

      <div className="contenedor" style={{ position: "relative" }}>
        {site.availability && (
          <Reveal index={0}>
            <p className="insignia">{site.availability}</p>
          </Reveal>
        )}

        <Reveal index={1}>
          <h1 id="titulo-portada" className="portada-nombre" style={{ marginTop: "1.5rem" }}>
            {site.name}
          </h1>
          <GoldRule />
        </Reveal>

        <Reveal index={2}>
          <p className="portada-rol cursiva">
            {roleParts.map((part, index) => (
              <span key={part}>
                {index > 0 && <span className="rol-sep" aria-hidden="true"> · </span>}
                <span className="rol-parte">{part}</span>
              </span>
            ))}
          </p>
        </Reveal>

        {paragraphs.length > 0 && (
          <Reveal index={3} className="portada-texto">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>
        )}

        {site.heroTags.length > 0 && (
          <Reveal index={4}>
            <ul className="etiquetas" style={{ listStyle: "none", padding: 0, margin: "2rem 0 0" }} aria-label="Tecnologías principales">
              {site.heroTags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal index={5} className="portada-acciones">
          <a href="#proyectos" className="boton">
            Ver proyectos
          </a>
          {site.cvUrl && (
            <a href={site.cvUrl} download className="enlace">
              <DownloadIcon />
              Descargar CV
            </a>
          )}
          <span className="portada-redes">
            {site.github && (
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="enlace">
                <GitHubIcon />
                GitHub
              </a>
            )}
            {site.linkedin && (
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="enlace">
                <LinkedInIcon />
                LinkedIn
              </a>
            )}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
