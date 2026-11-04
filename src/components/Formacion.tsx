import type { Section, TimelineItem } from "@/lib/schema";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";

export default function Formacion({ section, items }: { section: Section; items: TimelineItem[] }) {
  const visible = items.filter((item) => item.published);
  if (visible.length === 0) return null;

  return (
    <section id="formacion" className="seccion" aria-labelledby="titulo-formacion">
      <div className="contenedor">
        <SectionHeading section={section} id="titulo-formacion" />
        <ul className="rejilla" style={{ listStyle: "none", padding: 0 }}>
          {visible.map((item, index) => (
            <Reveal as="li" key={item.id} index={index}>
              <article className="panel">
                <p className="hito-periodo">{item.period}</p>
                <h3 className="panel-titulo">{item.title}</h3>
                {item.place && <p className="hito-lugar" style={{ marginTop: 0 }}>{item.place}</p>}
                {item.description && <p>{item.description}</p>}
                {item.tags.length > 0 && (
                  <ul className="etiquetas" style={{ listStyle: "none", padding: 0 }} aria-label="Tecnologías">
                    {item.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
