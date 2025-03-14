export interface CaseInfo {
  id: number; // Or string, depending on your API
  caseNumber: string;
  patient: string;
  doctor: string;
  entity_name: string;
  reg_date: string;
  caseStatus: number;
  status: string;
  submitted: boolean;
  actions: string;
  case_name: string;
}
