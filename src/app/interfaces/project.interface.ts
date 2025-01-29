export interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
  started_at: string;
  finished_at: string;
  status: string;
  created_at: string;
}

export interface PaginatedProjects {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}
