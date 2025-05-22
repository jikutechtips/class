import { Medication } from "./Medication";

export interface CaseInfo {
  id: number;
  appointmentId: string; // Or number, depending on your API
  caseNumber: string;
  clinicName: string;
  examination: string; // Or a more specific type if you parse it
  fileId: string | null;
  filename: string | null;
  patientId: string | null; // Or number, depending on your API
  patientName: string;
  regDate: string;
  status: string;
  updatedDate: string;

  patient: string;

  doctor: string;

  entity_name: string;

  reg_date: string;

  caseStatus: number;

  submitted: boolean;

  actions: string;

  case_name: string;

  upd_date: string;

  shade: string;
}

export interface ExaminationDetails {
  diagnosis: string;
  treatmentPlan: string;
  bill: string;
  medication: Medication;
  files: string;
  patientHistory: PatientHistory | any;
}

export interface PatientHistory {
  [x: string]: string;
  diagnoss: string;
  tplan: string;
  medication: any;
  complaints: string;
  hpillness: string;
  pastdmh: string;
  dentalexamination: string;
  investigation: string;
  comments: string;
}
