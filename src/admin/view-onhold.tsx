import * as React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { renderEditProgress, renderProgress } from "../cell-renderers/progress";
import {
  renderEditStatus,
  renderStatus,
  STATUS_OPTIONS,
} from "../cell-renderers/status";
import { CaseInfo } from "../interfaces/CaseInfo";

import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useSession } from "../SessionContext";

export default function ViewHolded() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [cases, setCase] = React.useState<CaseInfo[]>([]);
  const [rowss, setRows] = React.useState([]);
  const [cstatus, setCStatus] = useState("Received");
  //const router = useRouter();
  const deleteUser = React.useCallback(
    (id: number, isSubmitted: boolean) => () => {
      if (isSubmitted) {
        alert("Cases Submitted You Cant Delete ");
        return;
      }
      if (!confirm("Are you sure you want to delete this case?")) {
        return;
      }
      fetch(`${API_BASE_URL}/cases/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setCase((prevCases) => prevCases.filter((row) => row.id !== id));
          } else {
            console.error(`Failed to delete case with ID: ${id}`);
            // Handle error (e.g., display an error message to the user)
          }
        })
        .catch((error) => {
          console.error(`Error deleting case with ID: ${id}`, error);
          // Handle network or other errors
        });
    },
    [] // Added dependency to cases
  );
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/cases/${cstatus}/${session?.user?.entity_name}`, {
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
          setCase(data);
        }
      });
  }, [session?.user?.entity_name]);

  const columns: GridColDef<CaseInfo>[] = [
    { field: "caseNumber", headerName: "Name", width: 160, editable: false },
    { field: "patient", headerName: "Patient", width: 160, editable: false },
    { field: "doctor", headerName: "Doctor", width: 150, editable: false },
    {
      field: "entity_name",
      headerName: "Entity Name",
      width: 120,
      editable: false,
    },
    { field: "reg_date", headerName: "Created At", width: 160, editable: true },
    {
      field: "caseStatus",
      headerName: "Progress",
      renderCell: renderProgress,
      renderEditCell: renderEditProgress,
      availableAggregationFunctions: ["min", "max", "avg", "size"],
      type: "number",
      width: 100,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: renderStatus,
      renderEditCell: renderEditStatus,
      type: "singleSelect",
      valueOptions: STATUS_OPTIONS,
      width: 120,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 90,
      getActions: (params) => [
        <GridActionsCellItem
          key="delete" // Added key to resolve warning.
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => deleteUser(params.row.id, params.row.submitted)()} // Access id through params.row.id
          showInMenu
        />,
      ],
    },
  ];
  const rows: CaseInfo[] = cases;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ margin: "15px auto", height: "auto", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}
