export type FilterName = 'Original' | 'Color' | 'Grayscale' | 'BW' | 'Enhance';

export interface Page {
  id: string;
  originalUri: string;
  processedUri: string;
  filterName: FilterName;
  rotation: number;
  order: number;
}

export interface Document {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pages: Page[];
}

export interface ExportSettings {
  pageSize: 'Letter' | 'A4';
  margins: number;
  includePageNumbers: boolean;
}
