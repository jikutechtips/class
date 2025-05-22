export interface Patient {
  id: number;
  fullName: string;
  dob: string;
  phone: string;
  doctor: string | null;
  clinicName: string;
  regDate: string;
  gender: string;
  address: string;
  regFee: string;
}
