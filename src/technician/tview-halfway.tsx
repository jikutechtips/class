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
import { SyntheticEvent, useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import User from "../interfaces/User";
import { useSession } from "../SessionContext";
import CompleteCaseView from "../admin/completecaseview";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";

interface StatusOptions {
  status: string;
  value: string;
}

function getOptions(): StatusOptions[] {
  // Simulate fetching user data from an API
  const statusoptions: StatusOptions[] = [
    { status: "Finalizing", value: "0.75" },
  ];
  return statusoptions;
}
function getStatusMap(): Map<string, string> {
  const options = getOptions();
  const statusMap = new Map<string, string>();

  for (const option of options) {
    statusMap.set(option.status, option.value);
  }

  return statusMap;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TechViewCasesHalfway() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [cases, setCase] = React.useState<CaseInfo[]>([]);
  const [rowss, setRows] = React.useState([]);
  const [cstatus, setCStatus] = useState("Halfway");
  const [open, setOpen] = useState(false);
  const [technicians, setTechinicians] = useState<User[]>([]);
  const [technician, setTechnician] = useState();
  const [caseId, setCaseId] = useState();
  const statusO: StatusOptions[] = getOptions();
  const statusMap = getStatusMap();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [technicianIds, setTechnicianIds] = useState<Map<string, number>>(
    new Map()
  );
  const [technicianId, setTechnicianId] = useState("");
  const [opt, setOpt] = useState("");
  const [optValue, setOptValue] = useState("");
  const techId: any = session?.user?.name;

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
  const handleOptionSelected = (selectedOption: any) => {
    setOpt(selectedOption); // Assuming you have a state variable for the selected product

    if (statusMap.has(selectedOption)) {
      const selectedValue: any = statusMap.get(selectedOption);
      setOptValue(selectedValue); // Set the price in your state
      console.log(`The ID of ${selectedOption} is ${selectedValue}`);
    } else {
      console.log(`Price not found for ${selectedOption}`);
      setOptValue(""); // Or handle the case where the price is not found
    }
  };

  const handleSnackbarClose = (
    event: SyntheticEvent | Event,
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
    fetch(
      `${API_BASE_URL}/cases/status/${cstatus}/${technicianIds.get(techId)}`,
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
          setCase(data);
        }
      });
  }, [technicianIds.get(techId)]);

  const handleSaveStatus = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cases/${caseId}?status=${opt}&caseStatus=${optValue}&isSubmitted=true`,
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
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Close
            </Typography>{" "}
            <Autocomplete
              options={statusO.map((pt) => pt.status)}
              renderInput={(params) => (
                <TextField {...params} label="Progress Status" />
              )}
              onChange={(event: any, newValue: any | null) => {
                handleOptionSelected(newValue);
              }}
              size="small"
              sx={{ width: 170, mt: 1 }}
            />
            <Button autoFocus color="inherit" onClick={handleSaveStatus}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            {/* Mwanzo wa Maudhui ya dialog */}
            <CompleteCaseView caseId={caseId} />
          </DialogContentText>
        </DialogContent>
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
