
export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface Qualification {
  id: number;
  type: 'education' | 'certification';
  title: string;
  institution: string;
  duration: string;
  description: string;
  link?: string;
}

export interface ContactMethod {
  id: number;
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface HeaderData {
  logoText: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
}

export interface AboutData {
  imageUrl: string;
  title: string;
  description1: string;
  description2: string;
  description3: string;
}

export interface PortfolioData {
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  qualifications: Qualification[];
  contact: ContactMethod[];
  resumeUrl: string;
}
