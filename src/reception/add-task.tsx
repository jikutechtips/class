import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
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
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { CaseInfo } from "../interfaces/CaseInfo";
import { ColumnDefinition } from "../interfaces/ColumnDefinition";
import { ToothInfo } from "../interfaces/ToothInfo";

interface ButtonData {
  selectedItems: string[];
  buttonColors: Record<string, string>;
}
interface SwitchState {
  label: Record<string, boolean>;
}
interface SpCondition {
  spcondition: Record<string, boolean>;
}

interface Attach {
  attachmentstate: Record<string, boolean>;
}
interface Jina {
  name: string;
}

interface Kazi {
  type: string;
  teeth: number[];
  product: string;
  price: string;
}

function formatCurrency(
  amount: string | number,
  currencyCode = "TZS",
  locale = "en-US"
): string {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(amountNumber)) {
    return "Invalid Amount"; // Handle invalid input
  }

  return amountNumber.toLocaleString(locale, {
    style: "currency",
    currency: currencyCode,
  });
}

export default function ReceptionAddTask() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const work = "Work to be done";
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
  const [patientId, setPatientId] = useState("");
  const [teeth_condition, setTeeth_Condition] = useState();
  const [price, setPrice] = useState("");
  const [prothess, setProthess] = useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [prothesis, setProthesis] = React.useState<Prothesis[]>([]);
  const [productPrices, setProductPrices] = useState<Map<string, string>>(
    new Map()
  ); // Store prices in a Map
  const [rows, setRows] = React.useState<ToothInfo[]>([]);
  const [rows1, setRows1] = React.useState([]);
  const [showTeeth, setShowTeeth] = useState(false);
  const [jina, setJina] = useState<Jina[]>([]);
  const [tcondition, setTConditon] = useState();
  const [instruction, setInstruction] = React.useState<Prothesis[]>([]);
  const [tpcondition, setTpCondition] = React.useState<Prothesis[]>([]);
  const [attachments, setAttachments] = React.useState<Enclosed[]>([]);
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
  const [cases, setCase] = React.useState<CaseInfo[]>([]);
  const [tcases, setTCase] = React.useState<CaseInfo[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [rowId, sertRowId] = useState<string | number>();
  const [refresh, setRefresh] = useState("1");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileError(null); // Clear previous errors
    const file: any = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError("Please select a file first.");
      return;
    }

    setUploadStatus("Uploading...");
    setFileError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_BASE_URL}/api/files/upload/${patientId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus("");
        setSnackbarOpen(true);
        setSelectedFile(null); // Clear selection
      } else {
        try {
          const errorData = await response.json(); // Attempt to parse JSON error
          setUploadStatus(`${errorData?.message || response.statusText}`);
        } catch (jsonError) {
          setUploadStatus(`Upload failed: ${response.statusText}`);
        }
      }
    } catch (error) {
      setUploadStatus(`Upload failed: ${error}`);
    }
  };

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
          `${API_BASE_URL}/spcondition/${patientId}`
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
  }, [patientId]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/tpcondition/tp/${session?.user?.entity_name}`, {
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
  }, []);
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/enclosed/attachment/${session?.user?.entity_name}`, {
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
  }, []);

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

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/prothesis/pro/${session?.user?.entity_name}`, {
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
  }, []);

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
    fetch(`${API_BASE_URL}/products/prod/${session?.user?.entity_name}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data: Product[]) => {
        // Type the data
        if (data !== null) {
          setProducts(data);

          // Populate the Map:
          const newProductPrices = new Map<string, string>();
          data.forEach((product) =>
            newProductPrices.set(product.name, product.price)
          );
          setProductPrices(newProductPrices); // Update the state with the Map
        }
      });
  }, [session?.user?.entity_name]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/clients/byfullname/${session?.user?.name}`, {
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
          setDentist(data);
        }
      });
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      // Make it an async function
      if (mtuAliyechaguliwa?.fullName) {
        // Check if selectedDentist is not null and has a fullName
        try {
          const response = await fetch(
            `${API_BASE_URL}/patients/patient/${mtuAliyechaguliwa.fullName}`
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
  }, [mtuAliyechaguliwa?.fullName]);

  // Read Cases start
  useEffect(() => {
    const fetchCases = async () => {
      // Make it an async function
      if (mtuAliyechaguliwa?.fullName) {
        // Check if selectedDentist is not null and has a fullName
        try {
          const response = await fetch(
            `${API_BASE_URL}/cases/dc-case/${mtuAliyechaguliwa?.fullName}`
          );
          if (response.ok) {
            // Check if the response is ok (status 200-299)
            const data = await response.json();
            setCase(data);
            setDoctorTitle(""); // Important: Reset selected patient when dentist changes
          } else {
            console.error("Failed to fetch patients:", response.status);
            setCase([]); // Clear patients if the fetch fails
            setDoctorTitle(""); // Reset selected patient if the fetch fails
          }
        } catch (error) {
          console.error("Error fetching patients:", error);
          setCase([]); // Clear patients if there's an error
          setDoctorTitle(""); // Reset selected patient if there's an error
        }
      } else {
        setCase([]); // Clear patients if no dentist is selected
        setDoctorTitle(""); // Reset selected patient if no dentist is selected
      }
    };

    fetchCases(); // Call the async function
  }, [mtuAliyechaguliwa?.fullName]);

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
  const handleInputChange = (
    event: React.SyntheticEvent | Event,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string>
  ) => {
    if (value) {
      const mtu = watu.find((m) => m.fullName === value);
      setMtuAliyechaguliwa(mtu || null);
    } else {
      setMtuAliyechaguliwa(null);
      setMtuAliyechaguliwa1(null);
      setSelectedCase(null);
      setPatientId("");
      setSwitchStates({});
    }
  };

  const handleInputChange1 = (
    event: React.SyntheticEvent | Event,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string>
  ) => {
    if (value) {
      setSelectedCase(value);
      const pt: any = cases.find((m) => m.caseNumber === value);
      setMtuAliyechaguliwa1(pt || null);
      setPatientId(pt?.id);
    } else {
      setMtuAliyechaguliwa1(null);
      setPatientId("");
      setShowTeeth(false);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleShowTeeth = (state: boolean) => {
    setShowTeeth(state);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors
      if (mtuAliyechaguliwa1?.id) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/1/api/button-data/${mtuAliyechaguliwa1?.id}`
          ); // Your Spring Boot endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: ButtonData = await response.json(); // Type the response
          // setSelectedItems(data.selectedItems);
          setButtonColors(data.buttonColors);
          setPatientId(mtuAliyechaguliwa1?.id.toString());
          handleShowTeeth(true);
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
  }, [mtuAliyechaguliwa1?.id]);
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = event.currentTarget.textContent;
    if (buttonText) {
      const isSelected = selectedItems.includes(buttonText);
      const newColor = isSelected ? "outlined" : "contained"; // Toggle variant

      if (isSelected) {
        setSelectedItems(selectedItems.filter((item) => item !== buttonText));
      } else {
        clearles();
        setSelectedItems([...selectedItems, buttonText]);
      }

      // Update button color state
      setButtonColors((prevColors) => ({
        ...prevColors,
        [buttonText]: newColor,
      }));
    }
  };
  const clearles = () => {
    setSelectedItems([]);
  };
  // send selected item to database start

  const handleSubmit = async () => {
    try {
      const buttonData: ButtonData = {
        selectedItems,
        buttonColors,
      };

      console.log(JSON.stringify(buttonData));

      const response = await fetch(
        `${API_BASE_URL}/1/api/button-data/${mtuAliyechaguliwa1?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buttonData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(selectedItems.length);
      setSnackbarOpen(true);

      // Optionally, you can reset the form or update the UI
    } catch (error) {
      console.error("Error saving button data:", error);
      // Handle error, e.g., show an error message to the user
    }
  };
  // send selected item to database end
  const buttons = Array.from({ length: 8 }, (_, i) => 18 - i).map((number) => (
    <Button
      key={number}
      onClick={handleButtonClick}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      }
    >
      {number}
    </Button>
  ));

  const button = Array.from({ length: 8 }, (_, i) => i + 21).map((number) => (
    <Button
      key={number}
      onClick={handleButtonClick}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      }
    >
      {number}
    </Button>
  ));
  const button2 = Array.from({ length: 8 }, (_, i) => 48 - i).map((number) => (
    <Button
      key={number}
      onClick={handleButtonClick}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      }
    >
      {number}
    </Button>
  ));
  const button3 = Array.from({ length: 8 }, (_, i) => i + 31).map((number) => (
    <Button
      key={number}
      onClick={handleButtonClick}
      variant={
        (buttonColors[number] as "text" | "outlined" | "contained") ||
        "outlined"
      }
    >
      {number}
    </Button>
  ));

  const handleProductSelect = (selectedProductName: string) => {
    setProduct(selectedProductName); // Assuming you have a state variable for the selected product

    if (productPrices.has(selectedProductName)) {
      const selectedPrice: any = productPrices.get(selectedProductName);
      setPrice(selectedPrice); // Set the price in your state
      console.log(`The price of ${selectedProductName} is ${selectedPrice}`);
    } else {
      console.log(`Price not found for ${selectedProductName}`);
      setPrice(""); // Or handle the case where the price is not found
    }
  };
  const deleteUser = React.useCallback(
    (id: any) => () => {
      fetch(`${API_BASE_URL}/task-info/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          // Display an error message to the user (e.g., using a snackbar or alert)
          setSnackbarOpen(true); //You can use the snackbar to show an error message.
        });
      console.log(id);
    },
    [setRows, setSnackbarOpen] // Add dependencies
  );
  const registrationDateEAT = moment()
    .tz("Africa/Nairobi")
    .format("DD/MM/YYYY, h:mm:ss A");

  const addToothInfo = () => {
    const ttprice: any = parseInt(price) * selectedItems.length;
    fetch(`${API_BASE_URL}/task-info`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        patientId: mtuAliyechaguliwa1?.id,
        product: product,
        teeth: selectedItems.join(","),
        price: price,
        prothesis: prothess,
        teeth_condition: tcondition,
        reg_date: registrationDateEAT,
        entity_name: mtuAliyechaguliwa?.entity_name,
        total_price: ttprice,
        doctor: mtuAliyechaguliwa?.fullName,
        caseNumber: mtuAliyechaguliwa1?.caseNumber,
        caseId: patientId,
        quantity: selectedItems.length,
      }),
    })
      .then((response) => {
        if (response.status == 201) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
        }
        setRefresh("2");
        setSnackbarOpen(true);
      });
  };

  const fetchPatientTooth = async () => {
    if (refresh == "1") {
      if (mtuAliyechaguliwa1?.id) {
        // Check if selectedDentist is not null and has a fullName
        try {
          const response = await fetch(
            `${API_BASE_URL}/task-info/patient/${mtuAliyechaguliwa1?.id}`
          );
          if (response.ok) {
            // Check if the response is ok (status 200-299)

            const data = await response.json();

            handleShowTeeth(true);
            setRows(data);

            setRefresh(""); // Important: Reset selected patient when dentist changes
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
    }
    if (mtuAliyechaguliwa1?.id) {
      // Check if selectedDentist is not null and has a fullName
      try {
        const response = await fetch(
          `${API_BASE_URL}/task-info/patient/${mtuAliyechaguliwa1?.id}`
        );
        if (response.ok) {
          // Check if the response is ok (status 200-299)

          const data = await response.json();

          handleShowTeeth(true);
          setRows(data);
          setRefresh(""); // Important: Reset selected patient when dentist changes
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
  }, [mtuAliyechaguliwa1?.id, refresh]);

  const columnss = React.useMemo<ColumnDefinition[]>(
    () => [
      { field: "teeth", headerName: "Teeth", type: "string" },
      {
        field: "prothesis",
        headerName: "Prothesis",
        type: "string",
        width: 100,
      },
      {
        field: "teeth_condition",
        headerName: "Teeth Condition",
        type: "string",
        width: 100,
      },
      { field: "product", headerName: "Product", type: "string" },
      { field: "quantity", headerName: "Qty", type: "string", width: 70 },
      {
        field: "price",
        headerName: "Price",
        type: "number", // or number if you do the conversion earlier.
        valueFormatter: (
          value: React.SetStateAction<string | number | undefined>
        ) => {
          if (typeof value === "string") {
            return formatCurrency(value); // Use the formatCurrency function
          } else if (typeof value === "number") {
            return formatCurrency(value); // Use formatCurrency for numbers as well
          }
          return typeof value; // Handle other cases if necessary
        },
        width: 140,
      },
      {
        field: "total_price",
        headerName: "Total Price",
        type: "number", // or number if you do the conversion earlier.
        valueFormatter: (
          value: React.SetStateAction<string | number | undefined>
        ) => {
          if (typeof value === "string") {
            return formatCurrency(value); // Use the formatCurrency function
          } else if (typeof value === "number") {
            return formatCurrency(value); // Use formatCurrency for numbers as well
          }
          return typeof value; // Handle other cases if necessary
        },
        width: 140,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 120,
        getActions: (params: any) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteUser(params.id)}
            showInMenu
          />,
        ],
      },
    ],
    [deleteUser]
  );
  // Fetch when patientId changes

  const handleSwitchChange =
    (label: any) => (event: { target: { checked: boolean } }) => {
      setSwitchStates({
        ...switchStates,
        [label]: event.target.checked,
      });
    };

  const handleSpConditionChange =
    (spcondition: any) => (event: { target: { checked: boolean } }) => {
      setSpConditions({
        ...spconditions,
        [spcondition]: event.target.checked,
      });
    };
  const handleAttachmentStateChange =
    (at: any) => (event: { target: { checked: boolean } }) => {
      setAttach({
        ...attach,
        [at]: event.target.checked,
      });
    };

  const saveAttachmentState = async () => {
    const attachmentswitch: Attach = {
      attachmentstate: attach,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/at-switch/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attachmentswitch),
      });

      if (response.ok) {
        setSnackbarOpen(true);
      } else {
        console.error("Error saving switch states:", response.status);
        console.log(JSON.stringify(attachmentswitch));
      }
    } catch (error) {
      console.error("Error saving switch states:", error);
    }
  };

  const saveSPConditions = async () => {
    const switchedconditions: SpCondition = {
      spcondition: spconditions,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/spcondition/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(switchedconditions),
      });

      if (response.ok) {
        setSnackbarOpen(true);
      } else {
        console.error("Error saving switch states:", response.status);
        console.log(JSON.stringify(switchedconditions));
      }
    } catch (error) {
      console.error("Error saving switch states:", error);
    }
  };

  const saveSwitchStates = async () => {
    const switchedLabels: SwitchState = {
      label: switchStates,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/switch/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(switchedLabels),
      });
      console.log(JSON.stringify(switchedLabels) + patientId);
      if (response.ok) {
        setSnackbarOpen(true);
      } else {
        console.error("Error saving switch states:", response.status);
      }
    } catch (error) {
      console.error("Error saving switch states:", error);
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

  const submitTask = async () => {
    if (!termsAccepted) {
      alert("Accept terms and conditions");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/cases/${patientId}?isSubmitted=true&status=Pending`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(`Submission failed: ${errorData.message || "An error occurred"}`); // Display error to user
        return; // Exit the function
      }

      setSnackbarOpen(true); // Success! Open the snackbar
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Submission failed. Please try again."); // Display a general error to the user.
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            padding: 3,
            border: "none",
          },
        }}
      >
        <Paper elevation={3} sx={{ border: "none" }}>
          <Stack spacing={4} direction="row" sx={{ border: "none", p: 2 }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "200", marginTop: 0 },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography
                sx={{
                  paddingLeft: 2,
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "seagreen",
                  mb: 2,
                }}
              >
                DENTIST DETAILS
              </Typography>
              <Autocomplete
                options={watu.map((mtu) => mtu.fullName)}
                renderInput={(params) => (
                  <>
                    <TextField {...params} label="Select Dentist" />
                  </>
                )}
                onChange={handleInputChange}
                size="small"
                sx={{ width: 400 }}
              />

              {mtuAliyechaguliwa && (
                <Box
                  sx={{ width: 400 }}
                  component="form"
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    label="Full Name"
                    value={mtuAliyechaguliwa.fullName}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                  <TextField
                    label="Entity"
                    value={mtuAliyechaguliwa.entity_name}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                  <TextField
                    label="Title"
                    value={mtuAliyechaguliwa.title}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Box>
              )}
            </Box>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: 400, marginTop: 0 },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography
                sx={{
                  paddingLeft: 2,
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "seagreen",
                  mb: 2,
                }}
              >
                CHOOSE CASE
              </Typography>
              <Autocomplete
                options={cases.map((pt) => pt.caseNumber)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Case" />
                )}
                onChange={handleInputChange1}
                size="small"
                value={selectedCase}
                sx={{ width: 350 }}
              />

              {mtuAliyechaguliwa1 && (
                <Box component="form" noValidate autoComplete="off">
                  <TextField
                    label="Full Name"
                    value={mtuAliyechaguliwa1.patient}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                  <TextField
                    label="Entity"
                    value={mtuAliyechaguliwa1.entity_name}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                  <TextField
                    label="Title"
                    value={mtuAliyechaguliwa1.case_name}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Box>
              )}
            </Box>
          </Stack>
          <Stack sx={{ border: "none", padding: 3 }}>
            <Stack sx={{ border: 0, paddingLeft: 2 }}>
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
                <Stack direction={"column"} sx={{ paddingLeft: 5, border: 0 }}>
                  <Typography
                    sx={{
                      paddingTop: 3,
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
                            sx={{ backgroundColor: "primary" }}
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
                    </Stack>

                    {/* Display selected items */}
                    <div>
                      <Button
                        onClick={handleSubmit}
                        size="small"
                        sx={{ textTransform: "none" }}
                        variant="contained"
                      >
                        {" "}
                        Saved Selected
                      </Button>{" "}
                      <Button
                        onClick={handleClickOpen}
                        size="small"
                        sx={{ textTransform: "none" }}
                        variant="contained"
                      >
                        {" "}
                        Add Product
                      </Button>
                      {selectedItems.length === 0 ? (
                        <Chip label="None" />
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
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        component: "form",
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const formJson = Object.fromEntries(
                            (formData as any).entries()
                          );
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
                          Complete Task
                        </Typography>
                      </DialogTitle>
                      <DialogContent>
                        {
                          <Chip
                            sx={{ mb: 2, alignItems: "center" }}
                            color="success"
                            label={selectedItems.join(",")}
                          />
                        }
                        <br />
                        <DialogContentText>
                          {/* Mwanzo wa Maudhui ya dialog */}
                          <Autocomplete
                            options={prothesis.map((pt) => pt.name)}
                            renderInput={(params) => (
                              <TextField {...params} label="Process" />
                            )}
                            onChange={(event: any, newValue: any | null) => {
                              setProthess(newValue);
                            }}
                            size="small"
                            sx={{ width: 350 }}
                          />{" "}
                          <br />
                          <Autocomplete
                            options={jina.map((pt) => pt.name)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Tooth Condition"
                              />
                            )}
                            onChange={(event: any, newValue: any | null) => {
                              setTConditon(newValue);
                            }}
                            size="small"
                            sx={{ width: 350 }}
                          />{" "}
                          <br />
                          <Autocomplete
                            options={products.map((product) => product.name)}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Product" />
                            )}
                            onChange={(event, value) => {
                              if (value) {
                                handleProductSelect(value);
                              }
                            }} // Call when product is selected
                            size="small"
                            sx={{ width: 350 }}
                          />
                          {price && (
                            <p>
                              Price: {parseInt(price) * selectedItems.length}
                            </p>
                          )}{" "}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={addToothInfo} type="submit">
                          Add Info
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                  {/* Mwisho wa Kodi za Kuchagua jino */}
                </Stack>
              </Box>
            </Stack>
          </Stack>
          <Stack sx={{ border: 0, padding: 3 }}>
            {showTeeth && (
              <div style={{ height: "auto", width: "80" }}>
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
                        onChange={handleSwitchChange(item.name)}
                      />
                    }
                    label={item.name}
                  />
                ))}
                <Button
                  variant="contained"
                  onClick={saveSwitchStates}
                  sx={{ mt: 2, width: 30 }}
                  size="small"
                >
                  Save
                </Button>

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
                              onChange={handleSpConditionChange(item.name)}
                            />
                          }
                          label={item.name}
                        />
                      ))}
                      <Button
                        variant="contained"
                        onClick={saveSPConditions}
                        sx={{ mt: 2, width: 30 }}
                        size="small"
                      >
                        Save
                      </Button>
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
                            onChange={handleAttachmentStateChange(
                              item.attachment
                            )}
                          />
                        }
                        label={item.attachment}
                      />
                    ))}
                    <Button
                      variant="contained"
                      onClick={saveAttachmentState}
                      sx={{ width: 30 }}
                      size="small"
                    >
                      Save
                    </Button>
                    <Stack
                      spacing={2}
                      direction={"column"}
                      sx={{ border: 0, padding: 0, marginTop: 6 }}
                    >
                      <Typography
                        sx={{
                          paddingLeft: 2,
                          fontWeight: "bold",
                          fontSize: 24,
                        }}
                      >
                        Attach (Optional)
                      </Typography>{" "}
                      <Stack spacing={2} direction={"row"}>
                        <input
                          type="file"
                          id="fileInput"
                          onChange={handleFileChange}
                          style={{
                            display: "none",
                            marginTop: "4",
                            padding: 0,
                          }} // Hide the default input
                        />
                        <Button
                          variant="contained"
                          component="label"
                          htmlFor="fileInput"
                        >
                          Choose File
                        </Button>
                        {selectedFile && (
                          <Typography variant="body1">
                            Selected file: {selectedFile.name}
                          </Typography>
                        )}
                        {fileError && (
                          <Typography color="error">{fileError}</Typography>
                        )}
                        <Button
                          variant="contained"
                          onClick={handleUpload}
                          disabled={!selectedFile}
                          sx={{ mt: 2 }}
                        >
                          Upload
                        </Button>
                        {uploadStatus && (
                          <Typography sx={{ mt: 2 }}>{uploadStatus}</Typography>
                        )}
                      </Stack>
                    </Stack>
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
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(event) =>
                          setTermsAccepted(event.target.checked)
                        }
                        required // Make terms acceptance required
                      />
                    }
                    label={
                      <>
                        {" "}
                        {/* Use a fragment to wrap label content */}I accept the{" "}
                        <a href="">terms and conditions</a>
                      </>
                    }
                  />
                </Box>
              </FormGroup>
            </Stack>
          </Stack>
          <Stack sx={{ border: "none", padding: 3 }}>
            <Stack sx={{ border: 0, paddingLeft: 2 }}>
              {" "}
              <FormGroup> </FormGroup>
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Button variant="contained" onClick={submitTask} color="success">
              Submit Task
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
function fetchPatientTooth() {
  throw new Error("Function not implemented.");
}
