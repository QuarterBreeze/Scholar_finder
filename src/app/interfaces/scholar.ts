export interface Scholar {
  s_id: number;
  name: string;
  project_count?: number;
  institution?: string;
  department?: string;
  position?: string;
  mail?: string;
  phone?: string;
}

export interface Project {
  scholar_name?: string;
  scholar_s_id: number;
  project_name: string;
  project_EXCU?: string;
  project_YEAR: number;
  project_AMT: string;
  project_RESEARCHER?: string;
}
