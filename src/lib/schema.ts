import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const safeUrl = text(500).refine(
  (value) => !value || value.startsWith("/") || /^https?:\/\//i.test(value) || value.startsWith("mailto:"),
  "Debe ser una URL http(s), mailto o una ruta local"
);

const projectSchema = z.object({
  id: text(100).min(1),
  name: text(120).min(1),
  description: text(1500).min(1),
  image: safeUrl,
  multimedia: safeUrl,
  url: safeUrl,
  repo: safeUrl.default(""),
  year: text(20),
  tags: z.array(text(40).min(1)).max(20),
  collaborators: z.array(text(100).min(1)).max(10),
  badge: text(60),
  problem: text(600),
  solution: text(600),
  featured: z.boolean(),
  published: z.boolean(),
});

const timelineItemSchema = z.object({
  id: text(100).min(1),
  period: text(80).min(1),
  title: text(140).min(1),
  place: text(160),
  description: text(1500),
  badge: text(60),
  tags: z.array(text(40).min(1)).max(20),
  published: z.boolean(),
});

const skillGroupSchema = z.object({
  id: text(100).min(1),
  label: text(80).min(1),
  skills: z.array(text(60).min(1)).max(30),
});

const sectionSchema = z.object({
  eyebrow: text(60),
  title: text(120).min(1),
  intro: text(400),
});

export const portfolioContentSchema = z.object({
  site: z.object({
    name: text(100).min(1),
    role: text(180).min(1),
    availability: text(120),
    introduction: text(2500),
    location: text(120),
    email: z.string().trim().email(),
    github: safeUrl,
    linkedin: safeUrl,
    cvUrl: safeUrl,
    heroTags: z.array(text(40).min(1)).max(20),
    seoTitle: text(70).min(1),
    seoDescription: text(170).min(1),
    ogImage: safeUrl,
    illustration: safeUrl.default(""),
  }),
  sections: z.object({
    projects: sectionSchema,
    experience: sectionSchema,
    education: sectionSchema,
    skills: sectionSchema,
  }),
  projects: z.array(projectSchema).max(100),
  experience: z.array(timelineItemSchema).max(100),
  education: z.array(timelineItemSchema).max(100),
  skillGroups: z.array(skillGroupSchema).max(30),
  contact: z.object({ title: text(120).min(1), description: text(800) }),
});

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
export type Project = z.infer<typeof projectSchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Section = z.infer<typeof sectionSchema>;
