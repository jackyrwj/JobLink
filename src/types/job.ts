export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  tags: string[];
  description?: string;
  requirements?: string[];
  sourceUrl?: string;
} 