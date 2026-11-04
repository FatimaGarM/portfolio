import type { Section, TimelineItem } from "@/lib/schema";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";

export default function Experience({ section, items }: { section: Section; items: TimelineItem[] }) {
  const visible = items.filter((item) => item.published);
  if (visible.length === 0) return null;

  return (
    <section id="experiencia" className="seccion seccion-rosa" aria-labelledby="titulo-experiencia">
      <div className="contenedor">
        <SectionHeading section={section} id="titulo-experiencia" />
        <ol className="linea-tiempo">
          {visible.map((item, index) => (
            <Reveal as="li" key={item.id} index={index} className="hito">
              <p className="hito-periodo">
                {item.period}
                {item.badge && <span className="insignia" style={{ marginLeft: "0.85rem", textTransform: "none", letterSpacing: "0.04em" }}>{item.badge}</span>}
              </p>
              <h3 className="hito-titulo">{item.title}</h3>
              {item.place && <p className="hito-lugar">{item.place}</p>}
              {item.description && <p className="hito-texto">{item.description}</p>}
              {item.tags.length > 0 && (
                <ul className="etiquetas" style={{ listStyle: "none", padding: 0 }} aria-label="Tecnologías">
                  {item.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
