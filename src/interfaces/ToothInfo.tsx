import { PatientHistory } from "./CaseInfo";

export interface ToothInfo {
  id: string;
  teeth: string;
  product: string;
  patientId: string;
  price: string;
  regDate: string;
  clinicName: string;
  totalPrice: string;
  quantity: string;
  dignosis: string;
  examination: string;
  surface: string;
  preDiagnosis: string;
  finalDiagnosis: string;
  actions: any;
  patientHistory: PatientHistory | any;
}
