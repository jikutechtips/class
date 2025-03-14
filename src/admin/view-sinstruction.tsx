"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSession } from "../SessionContext";
import { Patient } from "../interfaces/Patient";
import { Prothesis } from "../interfaces/Prothesis";

export default function ViewSInstrution() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [count, setCount] = React.useState(0);
  const [instruction, setInstruction] = React.useState<Prothesis[]>([]);
  //const router = useRouter();

  React.useEffect(() => {
    fetch(
      `${API_BASE_URL}/sinstruction/instruction/${session?.user?.entity_name}`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          setInstruction(data);
        }
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Instruction", width: 130 },
  ];

  const rowss: Prothesis[] = instruction;

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
