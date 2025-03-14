import * as React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import Visibility from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import {
  Alert,
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import User from "../interfaces/User";
import { useSession } from "../SessionContext";
import CloseIcon from "@mui/icons-material/Close";
import { Bills } from "../interfaces/Bills";
import CheckCircle from "@mui/icons-material/CheckCircle";
import SpanningTable from "../pages/demo";
import CompleteCaseView from "./completecaseview";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ViewBills() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [bills, setBills] = React.useState<Bills[]>([]);
  const [rowss, setRows] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [technicians, setTechinicians] = useState<User[]>([]);
  const [technician, setTechnician] = useState();
  const [caseId, setCaseId] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const [technicianIds, setTechnicianIds] = useState<Map<string, number>>(
    new Map()
  );
  const [casId, setCasId] = useState("");
  const [doctyp, setDoctyp] = useState("");
  const [billen, setBillen] = useState("");
  const [bill_dat, setBill_dat] = useState("");
  const [discoun, setDiscoun] = useState("");
  const [additionalcos, setAdditionalcos] = useState("");
  const [docnumbe, setDocNumbe] = useState("");
  const [billId, setBillId] = useState("");
  const [docto, setDocto] = useState("");

  const [optionLabel, setOptionLabel] = useState("Approve");
  const handleSnackbarClose1 = () => {
    setSnackbarOpen1(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleClose1 = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    fetch(
      `${API_BASE_URL}/invoice/${casId}?doctype=${doctyp}&billend=${billen}&billdate=${bill_dat}&discount=${discoun}&additionalcost=${additionalcos}&ducnumber=${docnumbe}&client=${docto}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob(); // Get the response as a blob (binary large object)
      })
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", docnumbe); // Set the download attribute and filename
        document.body.appendChild(link); // Append to body to make it clickable

        // Trigger the download
        link.click();

        // Clean up by removing the link and revoking the URL

        // Add a null check here:
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download error:", error);
        // Handle download errors (e.g., show an error message)
      });
  };

  React.useEffect(() => {
    fetch(
      `${API_BASE_URL}/bills/by-entityname?entityname=${session?.user?.entity_name}`,
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
          setBills(data);
        }
      });
  }, [session?.user?.entity_name]);

  const approvebill = React.useCallback(
    (
      id: any,
      docttype: string,
      bill_date: any,
      billend: any,
      discount: any,
      additionalcost: any,
      docnumber: any,
      caseId: any,
      client: any
    ) =>
      async () => {
        if (docttype == "invoice") {
          setDocto(client);
          setBillId(id);
          setBill_dat(bill_date);
          setBillen(billend);
          setDoctyp(docttype);
          setDiscoun(discount);
          setCasId(caseId);
          setAdditionalcos(additionalcost);
          setDocNumbe(docnumber);
          setOpen(true);
        }
        setDocto(client);
        setBill_dat(bill_date);
        setBillen(billend);
        setDoctyp(docttype);
        setDiscoun(discount);
        setCasId(caseId);
        setAdditionalcos(additionalcost);
        setDocNumbe(docnumber);
        setOpen(true);
      },
    []
  );

  const handleApprove = async () => {
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
    const pref = "RCPT";
    const invoiceNumber = `${ABB}/${pref}/${YY}${MM}-${formattedInvoiceCount}`;
    // 3. Update the invoice count (PUT)
    const updateResponse = await fetch(
      `${API_BASE_URL}/bills/invoicecount/${billId}?invoiceCount=${invoiceCount}&doctype=${"receipt"}&docnumber=${invoiceNumber}`,
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
    setSnackbarOpen(true);
    setOptionLabel("View ");
  };

  const columns: GridColDef<Bills>[] = [
    {
      field: "docnumber",
      headerName: "Bill Number",
      width: 200,
      editable: false,
    },
    { field: "doctype", headerName: "Bill Type", width: 190, editable: false },

    {
      field: "bill_date",
      headerName: "Created At",
      width: 160,
      editable: false,
    },
    {
      field: "billend",
      headerName: "Exipires On",
      width: 170,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 190,
      getActions: (params) => [
        <GridActionsCellItem
          key="approve" // Added key to resolve warning.
          icon={
            params.row.doctype == "invoice" ? (
              <CheckCircle sx={{ color: "green" }} />
            ) : (
              <Visibility sx={{ color: "green" }} />
            )
          }
          label={params.row.doctype == "invoice" ? "Approve" : "View Receipt"}
          // onClick={() => deleteUser(params.row.id, params.row.submitted)()}
          onClick={approvebill(
            params.row.id,
            params.row.doctype,
            params.row.bill_date,
            params.row.billend,
            params.row.discount,
            params.row.additionalcost,
            params.row.docnumber,
            params.row.caseId,
            params.row.client
          )}
          showInMenu
        />,
      ],
    },
  ];
  const rows: Bills[] = bills;

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
      <div style={{ margin: "15px auto", height: "auto", width: "auto" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose1}
        TransitionComponent={Transition}
      >
        {" "}
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose1}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Close
            </Typography>

            <Stack>
              {doctyp === "invoice" ? (
                // Content to render when doctyp is "invoice"
                <div>
                  {" "}
                  <Button sx={{ color: "white" }} onClick={handleApprove}>
                    Approve
                  </Button>
                  <Button sx={{ color: "white" }} onClick={handleDownload}>
                    Download
                  </Button>
                </div>
              ) : (
                // Content to render when doctyp is not "invoice" (optional)
                <div>
                  {" "}
                  <Button sx={{ color: "white" }} onClick={handleDownload}>
                    Download
                  </Button>
                </div>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            {/* Mwanzo wa Maudhui ya dialog */}
            <SpanningTable
              caseId={casId}
              docttypee={doctyp}
              billend={billen}
              bill_date={bill_dat}
              discount={discoun}
              additionalcost={additionalcos}
              docnumber={docnumbe}
            />
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
          Approve Success
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarOpen1}
        autoHideDuration={1500}
        onClose={handleSnackbarClose1}
      >
        <Alert
          onClose={handleSnackbarClose1}
          severity="success" // Change severity as needed (success, error, warning, info)
          variant="filled"
          sx={{ width: "100%" }}
        >
          {optionLabel}
        </Alert>
      </Snackbar>
    </div>
  );
}
