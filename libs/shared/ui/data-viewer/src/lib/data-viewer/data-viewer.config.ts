export interface DataViewerConfig<T> {
  data: T[];
  columns?: string[];  // Optional array of column IDs to display
}
