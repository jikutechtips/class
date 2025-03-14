"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Users } from "./Users";

import { GymRecord } from "./GymRecord";
import { useNavigate } from "react-router-dom";

export default function BasicDataGrid() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [count, setCount] = React.useState(0);
  const [records, setRecords] = React.useState<GymRecord[]>([]);
  const [users, setUsers] = React.useState<Users[]>([]);
  //const router = useRouter();

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/users`, { method: "GET" })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          setUsers(data);
        }
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fullName", headerName: "Full Name", width: 130 },
    { field: "address", headerName: "Address", width: 130 },
    { field: "phone_number", headerName: "Phone Number", width: 130 },
    { field: "email", headerName: "Email Address", width: 130 },
    { field: "password", headerName: "Password", width: 130 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "entity_name", headerName: "Entity Name", width: 130 },
    { field: "registration_date", headerName: "Gender", width: 130 },
  ];

  const rowss: Users[] = users;

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
