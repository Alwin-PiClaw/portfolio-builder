export interface Project { id: string; title: string; description: string; image?: string; tags: string[]; link?: string; github?: string; }
export interface Experience { id: string; company: string; role: string; startDate: string; endDate: string; current: boolean; description: string; }
export interface Skill { name: string; level: number; category: 'frontend' | 'backend' | 'design' | 'other'; }
export interface Social { platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website'; url: string; }
export interface Portfolio {
  name: string; title: string; bio: string; avatar?: string; location?: string; email?: string;
  projects: Project[]; experience: Experience[]; skills: Skill[]; socials: Social[]; template: string;
}
