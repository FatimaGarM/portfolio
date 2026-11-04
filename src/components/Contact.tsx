import type { PortfolioContent } from "@/lib/schema";
import { GoldRule, Reveal } from "@/components/motion";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";

type Props = {
  contact: PortfolioContent["contact"];
  site: PortfolioContent["site"];
};

export default function Contact({ contact, site }: Props) {
  return (
    <>
      <section id="contacto" className="seccion contacto" aria-labelledby="titulo-contacto">
        <div className="contenedor">
          <Reveal>
            <p className="antetitulo">Contacto</p>
            <h2 id="titulo-contacto" className="titulo-seccion">
              {contact.title}
            </h2>
            <GoldRule />
            {contact.description && <p className="contacto-texto">{contact.description}</p>}
          </Reveal>

          <Reveal index={1}>
            <a href={`mailto:${site.email}`} className="contacto-email">
              <MailIcon size={22} className="contacto-email-icono" />
              {site.email}
            </a>
          </Reveal>

          <Reveal index={2} className="contacto-redes">
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
            {site.cvUrl && (
              <a href={site.cvUrl} download className="enlace">
                <DownloadIcon />
                Descargar CV
              </a>
            )}
          </Reveal>
        </div>
      </section>

      <footer className="pie">
        <div className="contenedor">
          <span>
            {site.name} · {new Date().getFullYear()}
          </span>
          {site.location && <span>{site.location}</span>}
        </div>
      </footer>
    </>
  );
}
