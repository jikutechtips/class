import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Autocomplete,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import { Clients } from "../interfaces/Clients";
import { useSession } from "../SessionContext";
import { Patient } from "../interfaces/Patient";
import { Product } from "../interfaces/Product";
import { Prothesis } from "../interfaces/Prothesis";
import { Enclosed } from "../interfaces/Enclosed";
import moment from "moment";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { CaseInfo } from "../interfaces/CaseInfo";

interface ButtonData {
  selectedItems: string[];
  buttonColors: Record<string, string>;
}

interface Jina {
  name: string;
}

export default function CompleteCaseView(props: any) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const work = "Adult Tooth Chart";
  const { session } = useSession();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mtuAliyechaguliwa, setMtuAliyechaguliwa] = useState<Clients | null>(
    null
  );
  const [mtuAliyechaguliwa1, setMtuAliyechaguliwa1] = useState<CaseInfo | null>(
    null
  );
  const [watu, setDentist] = useState<Clients[]>([]);
  const [toothConditions, setToothConditions] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [patient, setPatients] = useState<Patient[]>([]);
  const [doctorTitle, setDoctorTitle] = React.useState("");
  const [buttonColors, setButtonColors] = useState<Record<string, string>>({}); // Store colors
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState("");
  const [teethl, setTeethl] = useState();
  const [patientId, setPatientId] = useState(props.caseId);
  const [teeth_condition, setTeeth_Condition] = useState();
  const [price, setPrice] = useState("");
  const [prothess, setProthess] = useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [prothesis, setProthesis] = React.useState<Prothesis[]>([]);
  const [productPrices, setProductPrices] = useState<Map<string, string>>(
    new Map()
  ); // Store prices in a Map
  const [rows, setRows] = React.useState([]);
  const [rows1, setRows1] = React.useState([]);
  const [showTeeth, setShowTeeth] = useState(false);
  const [jina, setJina] = useState<Jina[]>([]);
  const [tcondition, setTConditon] = useState();
  //const router = useRouter();
  const [spconditions, setSpConditions] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [attach, setAttach] = useState<{ [key: string]: boolean }>({}); // Use an object to store states by label
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [cases, setCase] = React.useState<CaseInfo | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [mtuAliyechaguliwaId, setMtuAliyechaguliwaId] = useState(props.caseId);
  const [mtuAliyechaguliwaFullname, setMtuAliyechaguliwaFullname] =
    useState("");
  const [entityName, setEntityName] = useState("");
  const [instruction, setInstruction] = React.useState<Prothesis[]>([]);
  const [tpcondition, setTpCondition] = React.useState<Prothesis[]>([]);
  const [attachments, setAttachments] = React.useState<Enclosed[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      // Make it an async function
      if (mtuAliyechaguliwaId) {
        // Check if selectedDentist is not null and has a fullName
        try {
          const response = await fetch(
            `${API_BASE_URL}/cases/${mtuAliyechaguliwaId}`
          );
          if (response.ok) {
            // Check if the response is ok (status 200-299)
            const data = await response.json();
            setCase(data);
            setDoctorTitle(""); // Important: Reset selected patient when dentist changes
          } else {
            console.error("Failed to fetch patients:", response.status); // Reset selected patient if the fetch fails
          }
        } catch (error) {
          console.error("Error fetching patients:", error); // Reset selected patient if there's an error
        }
      } else {
        // Reset selected patient if no dentist is selected
      }
    };

    fetchCases();

    // Call the async function
  }, [mtuAliyechaguliwaId]);

  useEffect(() => {
    const fetchSwitchStates = async () => {
      if (!patientId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/switch/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setSwitchStates(data.label); // Extract the 'label' object
        } else {
          console.error("Failed to fetch switch states:", response.status);
        }
      } catch (error) {
        console.error("Error fetching switch states:", error);
      }
    };

    fetchSwitchStates();
  }, [patientId]);

  useEffect(() => {
    const fetchAttachmnentState = async () => {
      if (!patientId) {
        setAttach({});
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/at-switch/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setAttach(data.attachmentstate); // Extract the 'label' object
        } else {
          console.error(
            "Failed to fetch switch states: pd not selected",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching switch states:", error);
      }
    };

    fetchAttachmnentState();
  }, [patientId]);

  useEffect(() => {
    const fetchSpConditions = async () => {
      if (!patientId) {
        setSpConditions({});
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/spcondition/${mtuAliyechaguliwaId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSpConditions(data.spcondition);
          } else {
            setSpConditions({ ...spconditions });
          } // Extract the 'label' object
        } else {
          console.error("Failed to fetch switch states:", response.status);
        }
      } catch (error) {
        console.error("Error fetching switch states:", error);
      }
    };

    fetchSpConditions();
  }, [mtuAliyechaguliwaId]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/tpcondition/tp/${cases?.entity_name}`, {
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
          setTpCondition(data);
        }
      });
  }, [cases?.entity_name]);
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/enclosed/attachment/${cases?.entity_name}`, {
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
          setAttachments(data);
        }
      });
  }, [cases?.entity_name]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/sinstruction/instruction/${cases?.entity_name}`, {
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
          setInstruction(data);
        }
      });
  }, [cases?.entity_name]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/prothesis/pro/${cases?.entity_name}`, {
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
          setProthesis(data);
        }
      });
  }, [cases?.entity_name]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/tooth-condition`, {
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
          setJina(data);
        }
      });
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      // Make it an async function
      if (mtuAliyechaguliwaFullname) {
        // Check if selectedDentist is not null and has a fullName
        try {
          const response = await fetch(
            `${API_BASE_URL}/patients/patient/${mtuAliyechaguliwaFullname}`
          );
          if (response.ok) {
            // Check if the response is ok (status 200-299)
            const data = await response.json();
            setPatients(data);
            setDoctorTitle(""); // Important: Reset selected patient when dentist changes
          } else {
            console.error("Failed to fetch patients:", response.status);
            setPatients([]); // Clear patients if the fetch fails
            setDoctorTitle(""); // Reset selected patient if the fetch fails
          }
        } catch (error) {
          console.error("Error fetching patients:", error);
          setPatients([]); // Clear patients if there's an error
          setDoctorTitle(""); // Reset selected patient if there's an error
        }
      } else {
        setPatients([]); // Clear patients if no dentist is selected
        setDoctorTitle(""); // Reset selected patient if no dentist is selected
      }
    };

    fetchPatients(); // Call the async function
  }, [mtuAliyechaguliwaFullname]);

  // Read Cases start

  //Cases end

  // Add selectedDentist.fullName to the dependency array
  // Create your theme
  const theme = createTheme({
    palette: {
      mode: "light", // or 'dark'
      primary: {
        main: blue[500], // Example primary color
      },
      secondary: {
        main: blue[500], // Example secondary color
      },
      // ... other theme customizations
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors
      if (mtuAliyechaguliwaId) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/1/api/button-data/${patientId}`
          ); // Your Spring Boot endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: ButtonData = await response.json(); // Type the response
          // setSelectedItems(data.selectedItems);
          setButtonColors(data.buttonColors);
          setPatientId(mtuAliyechaguliwaId);
          setShowTeeth(true);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Error Fetching data"); // Set the error message
        } finally {
          setLoading(false); // Set loading to false after fetch, regardless of success/failure
        }
      } else {
        setSelectedItems([]);
        setButtonColors({});
      }
    };

    fetchData();
  }, [mtuAliyechaguliwaId]);

  // send selected item to database start

  // send selected item to database end
  const buttons = Array.from({ length: 8 }, (_, i) => 18 - i).map((number) => (
    <Button
      key={number}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      } // Set variant from state
    >
      {number}
    </Button>
  ));

  const button = Array.from({ length: 8 }, (_, i) => i + 21).map((number) => (
    <Button
      key={number}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      } // Set variant from state
    >
      {number}
    </Button>
  ));
  const button2 = Array.from({ length: 8 }, (_, i) => 48 - i).map((number) => (
    <Button
      key={number}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      } // Set variant from state
    >
      {number}
    </Button>
  ));
  const button3 = Array.from({ length: 8 }, (_, i) => i + 31).map((number) => (
    <Button
      key={number}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      } // Set variant from state
    >
      {number}
    </Button>
  ));

  const fetchPatientTooth = async () => {
    // Make it an async function
    if (mtuAliyechaguliwaId) {
      // Check if selectedDentist is not null and has a fullName
      try {
        const response = await fetch(
          `${API_BASE_URL}/task-info/patient/${mtuAliyechaguliwaId}`
        );
        if (response.ok) {
          // Check if the response is ok (status 200-299)
          const data = await response.json();
          setRows(data); // Important: Reset selected patient when dentist changes
        } else {
          console.error("Failed to fetch patients:", response.status);
          setRows([]); // Clear patients if the fetch fails
          //setDoctorTitle(""); // Reset selected patient if the fetch fails
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setRows([]); // Clear patients if there's an error
      }
    } else {
      setRows([]); // Clear patients if no dentist is selected
    }
  };

  useEffect(() => {
    fetchPatientTooth();
  }, [mtuAliyechaguliwaId]);

  const columnss: GridColDef[] = React.useMemo(
    () => [
      { field: "teeth", type: "string" },
      { field: "prothesis", type: "string" },
      { field: "teeth_condition", type: "string" },
      { field: "product", type: "string" },
      { field: "price", type: "string" },
      {
        field: "reg_date",
        type: "string",
      },
    ],
    []
  );

  // Fetch when patientId changes

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          height: "50vh", // Or whatever height you need
          "& > :not(style)": {
            m: 1,
            width: "80%",
            padding: 3,
            border: "none",
          },
        }}
      >
        <Paper elevation={3} sx={{ border: "none" }}>
          <Stack spacing={1} direction="column" sx={{ border: "none", p: 1 }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "200", marginTop: 0 },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography
                sx={{ paddingLeft: 0, fontWeight: "bold", fontSize: 18 }}
              >
                DENTIST DETAILS
              </Typography>

              <Box
                sx={{ width: 600, mb: 5 }}
                component="form"
                noValidate
                autoComplete="off"
              >
                <Stack spacing={2} direction={"row"}>
                  <Typography>Doctor Name:</Typography>
                  <Typography> {cases?.doctor}</Typography>{" "}
                </Stack>
              </Box>
            </Box>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: 300, marginTop: 0 },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography
                sx={{ paddingLeft: 0, fontWeight: "bold", fontSize: 18 }}
              >
                PATIENT DETAILS
              </Typography>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ width: 600 }}
              >
                <Stack spacing={2} direction={"row"}>
                  <Typography>Patient Name:</Typography>
                  <Typography> {cases?.patient}</Typography>{" "}
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <Typography>Patient At:</Typography>
                  <Typography> {cases?.entity_name}</Typography>{" "}
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <Typography>Case Number:</Typography>
                  <Typography> {cases?.caseNumber}</Typography>{" "}
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <Typography>Case Status:</Typography>
                  <Typography> {cases?.status}</Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
          <Stack sx={{ border: "none", padding: 1 }}>
            <Stack sx={{ border: 0, paddingLeft: 1 }}>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <Stack direction={"column"} sx={{ paddingLeft: 1, border: 0 }}>
                  <Typography
                    sx={{
                      paddingTop: 1,
                      paddingRight: 6,
                      border: 0,
                      m: 0,
                      fontSize: 27,
                    }}
                  >
                    {work}
                  </Typography>{" "}
                  {/* Mwanzo wa Code za Kuchagua jino */}
                  <Stack direction="column" spacing={1}>
                    <Stack>
                      {/* Start tooth Chart */}
                      <Box>
                        <ButtonGroup
                          size="small"
                          aria-label="Small button group"
                        >
                          {buttons}
                        </ButtonGroup>
                        <ButtonGroup
                          size="small"
                          aria-label="Small button group"
                        >
                          {button}
                        </ButtonGroup>
                        <Divider
                          orientation="horizontal"
                          variant="middle"
                          flexItem
                          sx={{ width: 600 }}
                        >
                          <Chip
                            sx={{ backgroundColor: "info" }}
                            label=""
                            size="small"
                          />
                        </Divider>
                        <ButtonGroup
                          size="small"
                          aria-label="Small button group"
                        >
                          {button2}
                        </ButtonGroup>
                        <ButtonGroup
                          size="small"
                          aria-label="Small button group"
                        >
                          {button3}
                        </ButtonGroup>
                      </Box>
                      {/* End Of Tooth Chart */}
                    </Stack>

                    {/* Display selected items */}
                    <div>
                      {selectedItems.length === 0 ? (
                        <Typography></Typography>
                      ) : (
                        selectedItems.map((item) => (
                          <>
                            <Chip
                              key={item}
                              label={item}
                              onDelete={() => {
                                setSelectedItems(
                                  selectedItems.filter((i) => i !== item)
                                );
                                setButtonColors((prevColors) => ({
                                  ...prevColors,
                                  [item]: "outlined",
                                })); // Reset color
                              }}
                            />
                          </>
                        ))
                      )}
                    </div>
                  </Stack>
                  {/* Mwisho wa Kodi za Kuchagua jino */}
                </Stack>
              </Box>
            </Stack>
          </Stack>
          <Stack sx={{ border: 0, padding: 3 }}>
            {showTeeth && (
              <div style={{ height: "auto", width: "80%" }}>
                <DataGrid
                  rows={rows}
                  columns={columnss}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                />
              </div>
            )}
          </Stack>
          <Stack sx={{ border: 0, padding: 3 }}>
            {" "}
            <Typography
              sx={{ paddingLeft: 2, fontWeight: "bold", fontSize: 24 }}
            >
              Special Instruction
            </Typography>{" "}
            <Stack sx={{ border: 0, paddingLeft: 2 }}>
              {" "}
              <FormGroup>
                {instruction.map((item) => (
                  <FormControlLabel
                    key={item.name} // Assuming item.name is unique
                    control={
                      <Switch
                        checked={switchStates[item.name] || false} // Default to false if not found
                      />
                    }
                    label={item.name}
                  />
                ))}
              </FormGroup>
              <Stack>
                <FormGroup sx={{ paddingLeft: 5, mt: 3 }}>
                  {" "}
                  <Typography
                    sx={{ paddingLeft: 2, fontWeight: "bold", fontSize: 19 }}
                  >
                    Conditions
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <FormGroup>
                      {tpcondition.map((item) => (
                        <FormControlLabel
                          key={item.name} // Assuming item.name is unique
                          control={
                            <Switch
                              checked={spconditions[item.name] || false} // Default to false if not found
                            />
                          }
                          label={item.name}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </FormGroup>
              </Stack>
            </Stack>
          </Stack>
          <Stack sx={{ border: "none", padding: 3 }}>
            <Typography
              sx={{ paddingLeft: 2, fontWeight: "bold", fontSize: 24 }}
            >
              Enclosed
            </Typography>{" "}
            <Stack sx={{ border: 0, paddingLeft: 2 }}>
              {" "}
              <FormGroup sx={{ paddingLeft: 5, mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <FormGroup>
                    {attachments.map((item) => (
                      <FormControlLabel
                        key={item.attachment} // Assuming item.name is unique
                        control={
                          <Switch
                            checked={attach[item.attachment] || false} // Default to false if not found
                          />
                        }
                        label={item.attachment}
                      />
                    ))}
                  </FormGroup>
                </Box>
                <Typography
                  sx={{
                    paddingLeft: 2,
                    mt: 4,
                    fontWeight: "bold",
                    fontSize: 19,
                  }}
                >
                  Others
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Others"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{ width: 400, mt: 2, mb: 2 }}
                />
              </FormGroup>
            </Stack>
          </Stack>
          <Stack sx={{ border: "none", padding: 3 }}>
            <Stack sx={{ border: 0, paddingLeft: 2 }}>
              {" "}
              <FormGroup>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                ></Box>
              </FormGroup>
            </Stack>
          </Stack>
          <Stack sx={{ border: "none", padding: 3 }}>
            <Stack sx={{ border: 0, paddingLeft: 2 }}>
              {" "}
              <FormGroup>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                ></Box>
              </FormGroup>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
