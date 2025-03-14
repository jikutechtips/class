export interface ColumnDefinition {
  field: string;
  headerName?: string; // Optional header name
  type: "string" | "actions" | "number";
  width?: number;
  getActions?: (params: any) => React.ReactNode[];
}
