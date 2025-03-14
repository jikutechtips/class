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
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import User from "../interfaces/User";
import { useSession } from "../SessionContext";

export default function ViewPendings() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [cases, setCase] = React.useState<CaseInfo[]>([]);
  const [rowss, setRows] = React.useState([]);
  const [cstatus, setCStatus] = useState("Pending");
  const [open, setOpen] = useState(false);
  const [technicians, setTechinicians] = useState<User[]>([]);
  const [technician, setTechnician] = useState();
  const [caseId, setCaseId] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [technicianIds, setTechnicianIds] = useState<Map<string, number>>(
    new Map()
  );
  const [technicianId, setTechnicianId] = useState("");

  const handleClickOpen = () => {};

  const handleClose = () => {
    setOpen(false);
  };

  const handleTechnicianSelect = (selectedTechnician: any) => {
    setTechnician(selectedTechnician); // Assuming you have a state variable for the selected product

    if (technicianIds.has(selectedTechnician)) {
      const selectedTids: any = technicianIds.get(selectedTechnician);
      setTechnicianId(selectedTids); // Set the price in your state
      console.log(`The ID of ${selectedTechnician} is ${selectedTids}`);
    } else {
      console.log(`Price not found for ${selectedTechnician}`);
      setTechnicianId(""); // Or handle the case where the price is not found
    }
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const manageCase = React.useCallback(
    (id: any) => () => {
      setOpen(true);
      setCaseId(id);
    },
    [] // Added dependency to cases
  );

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/users/${session?.user?.entity_name}/title/technician`,
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
      .then((data: User[]) => {
        // Type the data
        if (data !== null) {
          setTechinicians(data);

          // Populate the Map:
          const newTechIds = new Map<string, number>();
          data.forEach((technician) =>
            newTechIds.set(technician.fullName, technician.id)
          );
          setTechnicianIds(newTechIds); // Update the state with the Map
        }
      });

    console.log(technicianIds);
  }, [session?.user?.entity_name]);

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

  const handleassign = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cases/${caseId}?technicianid=${technicianId}&status=Received&technician_name=${technician}&isSubmitted=true`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData); // Display error to user
        return; // Exit the function
      }
      setCase((prevCases) => prevCases.filter((row) => row.id !== caseId));
      setSnackbarOpen(true); // Success! Open the snackbar
    } catch (error) {
      console.error("Fetch Error:", error); // Display a general error to the user.
    }
  };

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
    {
      field: "reg_date",
      headerName: "Created At",
      width: 160,
      editable: false,
    },
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
          key="manage" // Added key to resolve warning.
          icon={<SettingsIcon />}
          label="Manage"
          // onClick={() => deleteUser(params.row.id, params.row.submitted)()}
          onClick={manageCase(params.row.id)}
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
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>
          <Typography
            sx={{
              paddingLeft: 2,
              fontWeight: "bold",
              fontSize: 26,
            }}
          >
            Assignment Form
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Mwanzo wa Maudhui ya dialog */}
            <Autocomplete
              options={technicians.map((pt) => pt.fullName)}
              renderInput={(params) => (
                <TextField {...params} label="Select Technician" />
              )}
              onChange={(event: any, newValue: any | null) => {
                handleTechnicianSelect(newValue);
              }}
              size="small"
              sx={{ width: 350, mt: 1 }}
            />{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "none" }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleassign}
            type="submit"
            color="success"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success" // Change severity as needed (success, error, warning, info)
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
