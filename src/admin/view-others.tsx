"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSession } from "../SessionContext";
import { Patient } from "../interfaces/Patient";
import { Prothesis } from "../interfaces/Prothesis";

export default function ViewOthers() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [count, setCount] = React.useState(0);
  const [others, setOthers] = React.useState<Prothesis[]>([]);
  //const router = useRouter();

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/others/dr-notes/${session?.user?.entity_name}`, {
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
          setOthers(data);
        }
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Notes", width: 130 },
  ];

  const rowss: Prothesis[] = others;

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
