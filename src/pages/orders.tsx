import * as React from "react";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { DentalEntities } from "./DentalEntities";

export default function OrdersPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [count, setCount] = React.useState(0);
  const [dentalEntities, setDentalEnties] = React.useState<DentalEntities[]>(
    []
  );
  //const router = useRouter();

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/dental_entities`, { method: "GET" })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          setDentalEnties(data);
        }
      });
  }, []);

  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "entity_name", headerName: "Entity Name", width: 130 },
    { field: "entity_address", headerName: "Entity Address", width: 130 },
    { field: "entity_email", headerName: "Entity Email", width: 130 },
    { field: "entity_phone", headerName: "Entity Phone", width: 130 },
    { field: "entity_logoUrl", headerName: "Entity Logo", width: 130 },
    { field: "entity_reg_date", headerName: "Registration", width: 130 },
  ];

  const rowss: DentalEntities[] = dentalEntities;

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
