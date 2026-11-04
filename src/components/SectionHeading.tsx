import type { Section } from "@/lib/schema";
import { GoldRule, Reveal } from "@/components/motion";

export default function SectionHeading({ section, id }: { section: Section; id: string }) {
  return (
    <Reveal>
      {section.eyebrow && <p className="antetitulo">{section.eyebrow}</p>}
      <h2 id={id} className="titulo-seccion">
        {section.title}
      </h2>
      <GoldRule />
      {section.intro && <p className="intro-seccion">{section.intro}</p>}
    </Reveal>
  );
}
