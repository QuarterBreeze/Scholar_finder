export interface Scholar {
  scholar_name: string;
  scholar_project_count: number;
  scholar_s_id: number;
}

export interface Project {
  scholar_name: string;
  scholar_s_id: number;
  project_name: string;
  project_EXCU: string;
  project_YEAR: number;
  project_AMT: number;
  project_RESEARCHER: string;
}
