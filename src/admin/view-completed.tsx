import * as React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { renderEditProgress, renderProgress } from "../cell-renderers/progress";
import {
  renderEditStatus,
  renderStatus,
  STATUS_OPTIONS,
} from "../cell-renderers/status";
import { CaseInfo } from "../interfaces/CaseInfo";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import DeleteIcon from "@mui/icons-material/Delete";
import { SyntheticEvent, useEffect, useState } from "react";
import { useSession } from "../SessionContext";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { legendClasses } from "@mui/x-charts";
function getFutureDate(daysToAdd: number): string {
  const today = new Date();
  const futureDate = new Date(
    today.getTime() + daysToAdd * 24 * 60 * 60 * 1000
  ); // Add days in milliseconds

  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(futureDate.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`; // Format as YYYY-MM-DD
}
export default function ViewCompleted() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [cases, setCase] = React.useState<CaseInfo[]>([]);
  const [rowss, setRows] = React.useState([]);
  const [cstatus, setCStatus] = useState("Completed");
  const [caseId, setCaseId] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [billId, setBillId] = useState("");
  const [doctor, setDoctor] = useState("");
  const [discount, setDiscount] = useState("");
  const [additionalcost, setAdditionalCost] = useState("");
  const [lastingdays, setLastingDays] = useState("");
  const [invoiceCount, setInvoiceCount] = useState("");
  const billend: number =
    parseInt(lastingdays) > 14 ? parseInt(lastingdays) : 14;
  const handleClickOpen = () => {};

  const handleClose = () => {
    setOpen(false);
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
    (id: any, doctor: any) => () => {
      setDoctor(doctor);
      setOpen(true);
      setCaseId(id);
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
  }, []);

  const handleassign = async () => {
    try {
      // 1. Create the bill (POST)
      const createResponse = await fetch(`${API_BASE_URL}/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: caseId,
          doctype: "invoice",
          discount: discount,
          additionalcost: additionalcost,
          lastingdays: lastingdays,
          entityname: session?.user?.entity_name,
          bill_date: getFutureDate(0),
          billend: getFutureDate(billend),
          client: doctor,
        }),
      });

      if (!createResponse.ok) {
        // Handle bill creation error
        console.error("Error creating bill:", await createResponse.json());
        return;
      }

      const newBill = await createResponse.json();
      const billId = newBill.id;
      const doctype = newBill.doctype; // Get the bill ID

      // 2. Fetch the invoice count (GET)
      const countResponse = await fetch(
        `${API_BASE_URL}/bills/count-by-entityname?entityname=${session?.user?.entity_name}`,
        {
          method: "GET",
        }
      );

      if (!countResponse.ok) {
        // Handle error fetching invoice count
        console.error(
          "Error fetching invoice count:",
          await countResponse.json()
        );
        return;
      }

      const invoiceCountData = await countResponse.json();
      const invoiceCount = invoiceCountData; // Extract the count
      const entiName: any = session?.user?.entity_name;
      const ABB = generateAbbreviation(entiName);
      const currentYear = new Date().getFullYear();
      const YY = getTwoDigitYear(currentYear);
      const currentMonth = new Date().getMonth() + 1;
      const MM = currentMonth.toString().padStart(2, "0");
      const formattedInvoiceCount = invoiceCount.toString().padStart(4, "0");
      const pref = doctype == "invoice" ? "INV" : "RCPT";
      const invoiceNumber = `${ABB}/${pref}/${YY}${MM}-${formattedInvoiceCount}`;
      // 3. Update the invoice count (PUT)
      const updateResponse = await fetch(
        `${API_BASE_URL}/bills/invoicecount/${billId}?invoiceCount=${invoiceCount}&doctype=${"invoice"}&docnumber=${invoiceNumber}`,
        {
          method: "PUT",
        }
      );

      if (!updateResponse.ok) {
        // Handle update error
        console.error(
          "Error updating invoice count:",
          await updateResponse.json()
        );
        return;
      }

      // 4. Update state and show success message
      setDiscount("");
      setAdditionalCost("");
      setLastingDays("");
      setInvoiceCount(invoiceCountData); // Update state correctly
      setSnackbarOpen(true);
      console.log("BillId:  ", billId);
      console.log("Count:  ", invoiceCount);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchCaseInfo = async () => {
      if (caseId) {
        try {
          fetch(`${API_BASE_URL}/bills/by-caseId/${caseId}`, {
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
                setBillId(data.id);
                console.log(data.id);
              }
            });
        } catch (caseError) {
          console.error("Error fetching case:", caseError);
          setBillId("");
        }
      } else {
        setBillId("");
      }
    };
    fetchCaseInfo();
  }, [caseId]);
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
          key="bill" // Added key to resolve warning.
          icon={<ReceiptLong sx={{ color: "green" }} />}
          label="Generate Bill"
          onClick={manageCase(params.row.id, params.row.doctor)} // Access id through params.row.id
          showInMenu
        />,
      ],
    },
  ];
  const rows: CaseInfo[] = cases;

  function getTwoDigitYear(year: number): string {
    const yearString = year.toString();
    return yearString.slice(-2);
  }

  function generateAbbreviation(clinicName: string): any {
    if (!clinicName) {
      return "";
    }

    const words = clinicName.split(" ");
    const abbreviation = words
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    return abbreviation;
  }
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
              color: "darkgreen",
            }}
          >
            Bill Extra Information
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormGroup>
              <TextField
                required
                id="discount"
                label="Possible Discount"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                variant="standard"
              />
              <TextField
                id="additionalcost"
                label="Additional Cost"
                onChange={(e) => setAdditionalCost(e.target.value)}
                variant="standard"
                value={additionalcost}
              />
              <TextField
                id="lastingdays"
                label="Possible Lasting Days"
                onChange={(e) => setLastingDays(e.target.value)}
                variant="standard"
                value={lastingdays}
              />
            </FormGroup>
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
            Create Bill
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
