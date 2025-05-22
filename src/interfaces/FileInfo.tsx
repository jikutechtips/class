export interface FileInfo {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  patient_id: string;
  entity_name: string | null;
}
