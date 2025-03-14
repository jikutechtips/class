import {
  Autocomplete,
  Button,
  CssBaseline,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import AppTheme from "../theme/AppTheme";
import { useSession } from "../SessionContext";
import { useEffect, useState } from "react";
import { Patient } from "../interfaces/Patient";
import moment from "moment";
import { event } from "jquery";

export default function CreateCase(props: { disableCustomTheme?: boolean }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState("");
  const [casename, setCaseName] = useState("");
  const [mounthlycount, setMonthlyCount] = useState("");
  const [cNumber, setCNumber] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [count, setCount] = useState();
  const [errorname, setErrorName] = useState("");
  const [er, setEr] = useState(false);

  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const entiName: any = session?.user?.entity_name;
  const ABB = generateAbbreviation(entiName);
  const YY = getTwoDigitYear(currentYear);
  const MM = currentMonth.toString().padStart(2, "0");
  const caseNumber = `${ABB}/CAS/${YY}${MM}-${mounthlycount}`;

  function getTwoDigitYear(year: number): string {
    const yearString = year.toString();
    return yearString.slice(-2);
  }
  function generateAbbreviation(clinicName: string): any {
    if (!clinicName) {
      return ""; // Return empty string for null or empty input
    }

    const words = clinicName.split(" ");
    const abbreviation = words
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    return abbreviation;
  }
  async function fetchData() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cases/monthly/${currentYear}/${currentMonth}/${session?.user?.entity_name}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json(); // Assuming the API returns a number
      setMonthlyCount((data + 1).toString().padStart(4, "0"));
      console.log(mounthlycount);
      // Set the actual data
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle the error (e.g., display an error message to the user)
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaseName(event.target.value);
    setErrorName("");
    setEr(false);
    fetchData();
    // You can also access the value directly using event.target.value
    console.log(mounthlycount);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      // Make it an async function
      if (session?.user?.name) {
        // Check if selectedDentist is not null and has a fullName
        try {
          const response = await fetch(
            `${API_BASE_URL}/patients/patient/${session?.user?.name}`
          );
          if (response.ok) {
            // Check if the response is ok (status 200-299)
            const data = await response.json();
            setPatients(data);
          } else {
            console.error("Failed to fetch patients:", response.status);
            setPatients([]); // Clear patients if the fetch fails
          }
        } catch (error) {
          console.error("Error fetching patients:", error);
          setPatients([]); // Clear patients if there's an error
        }
      } else {
        setPatients([]); // Clear patients if no dentist is selected
      }
    };

    fetchPatients(); // Call the async function
  }, [session?.user?.name]);

  const registrationDateEAT = moment()
    .tz("Africa/Nairobi")
    .format("YYYY-MM-DD HH:mm:ss");
  const handleSubmit = () => {
    if (casename.trim() === "") {
      setErrorName("This Field is Required");
      setEr(true); // Or display a more user-friendly error message
      return; // Stop the form submission
    }

    fetch(`${API_BASE_URL}/cases/add-case`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        doctor: session?.user?.name,
        patient: patient,
        caseNumber: `${ABB}/CAS/${YY}${MM}-${mounthlycount}`,
        caseName: casename,
        caseStatus: "0",
        entity_name: session?.user?.entity_name,
        isSubmitted: false,
        status: "Draft",
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

        // alert(`${ABB}/CAS/${YY}${MM}-${mounthlycount}`)
        setMonthlyCount("");
        setCaseName("");
        setPatient("");
      });
  };
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Stack>
        <FormGroup sx={{ width: 350 }}>
          <Autocomplete
            options={patients.map((pt) => pt.name)}
            renderInput={(params) => (
              <TextField {...params} label="Choose Patient" />
            )}
            onChange={(event: any, newValue: any | null) => {
              setPatient(newValue);
            }}
            value={patient}
            size="small"
            sx={{ mb: 5 }}
          />
          <TextField
            error={er}
            id="name"
            label="Case Name"
            onChange={handleInputChange}
            type="search"
            value={casename}
            variant="standard"
            required
            helperText={errorname}
            size="small"
            sx={{ mb: 5 }}
          />
          <Button
            sx={{
              textTransform: "none",
              float: "center",
            }}
            variant="contained"
            onClick={handleSubmit}
          >
            Add Case
          </Button>
        </FormGroup>
      </Stack>
    </AppTheme>
  );
}
