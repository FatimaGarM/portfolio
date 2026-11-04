import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Formacion from "@/components/Formacion";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { getContent } from "@/lib/repository";

export default function Home() {
  const content = getContent();
  const { sections } = content;

  const links = [
    { href: "#proyectos", label: sections.projects.eyebrow || "Proyectos" },
    { href: "#experiencia", label: sections.experience.eyebrow || "Experiencia" },
    { href: "#formacion", label: sections.education.eyebrow || "Formación" },
    { href: "#tecnologias", label: sections.skills.eyebrow || "Tecnologías" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <>
      <a href="#contenido" className="salto">
        Saltar al contenido
      </a>
      <Nav name={content.site.name} links={links} />
      <main id="contenido">
        <Hero site={content.site} />
        <Projects section={sections.projects} projects={content.projects} />
        <Experience section={sections.experience} items={content.experience} />
        <Formacion section={sections.education} items={content.education} />
        <Skills section={sections.skills} groups={content.skillGroups} />
        <Contact contact={content.contact} site={content.site} />
      </main>
    </>
  );
}
