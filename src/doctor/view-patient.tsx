"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSession } from "../SessionContext";
import { Patient } from "../interfaces/Patient";

export default function ViewPatient() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [count, setCount] = React.useState(0);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  //const router = useRouter();

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/patients/patient/${session?.user?.name}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          setPatients(data);
        }
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Full Name", width: 130 },
    { field: "phone", headerName: "Phone Number", width: 130 },
    { field: "doctor", headerName: "Doctor", width: 130 },
    { field: "entity_name", headerName: "Entity Name", width: 130 },
    { field: "reg_date", headerName: "Registration Date", width: 130 },
    { field: "gender", headerName: "Gender", width: 130 },
  ];

  const rowss: Patient[] = patients;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      ></div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rowss} columns={columns} pagination />
      </div>
    </>
  );
}
