import { TemplateRef } from "@angular/core";

export interface DataViewerConfig<T> {
  data: T[];
  columns?: string[];  // Optional array of column IDs to display
}

export interface ColumnConfig<T> {
  key: string;
  header: string;
  cell?: (element: T) => string | number | boolean;
  cellTemplate?: TemplateRef<{ $implicit: unknown }>;
}
