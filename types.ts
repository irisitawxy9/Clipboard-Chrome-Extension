
export type SnippetType = 'Experience' | 'Education' | 'Skill' | 'Project' | 'Summary' | 'Other';

export interface JobCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Snippet {
  id: string;
  content: string;
  type: SnippetType;
  categoryId: string; // Linking to JobCategory
  createdAt: number;
  lastUsedAt?: number;
}

export interface AppState {
  snippets: Snippet[];
  categories: JobCategory[];
  activeCategoryId: string;
  searchQuery: string;
}
