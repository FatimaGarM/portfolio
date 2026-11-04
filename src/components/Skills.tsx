import type { Section, SkillGroup } from "@/lib/schema";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";

export default function Skills({ section, groups }: { section: Section; groups: SkillGroup[] }) {
  const visible = groups.filter((group) => group.skills.length > 0);
  if (visible.length === 0) return null;

  return (
    <section id="tecnologias" className="seccion seccion-rosa" aria-labelledby="titulo-tecnologias">
      <div className="contenedor">
        <SectionHeading section={section} id="titulo-tecnologias" />
        <ul className="rejilla" style={{ listStyle: "none", padding: 0 }}>
          {visible.map((group, index) => (
            <Reveal as="li" key={group.id} index={index}>
              <div className="panel">
                <h3 className="panel-titulo">{group.label}</h3>
                <ul className="etiquetas" style={{ listStyle: "none", padding: 0 }}>
                  {group.skills.map((skill) => (
                    <li key={skill} className="chip">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
