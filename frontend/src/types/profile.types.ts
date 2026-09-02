export interface Meta {
  name: string;
  roles: string[];
  tagline: string;
  resumeUrl: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

export interface Education {
  degree: string;
  institution: string;
  gpa: string;
  period: string;
}

export interface Skills {
  [category: string]: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  tech: string[];
  bullets: string[];
}

export interface Project {
  name: string;
  subtitle: string;
  image?: string;
  live: string | null;
  github: string;
  tech: string[];
  bullets: string[];
}

export interface Achievement {
  title: string;
  description: string;
  icon: 'trophy' | 'medal' | 'code';
}

export interface Profile {
  meta: Meta;
  education: Education;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
}
