import React, { useState, useMemo } from "react";
import { Avatar, Box, Stack, TextField, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

// Mock Data for Staff List
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "firstName", headerName: "First Name", width: 100 },
  { field: "lastName", headerName: "Last Name", width: 100 },
  { field: "role", headerName: "Role", width: 120 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 120 },
];

const rows: GridRowsProp = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    role: "Dentist",
    email: "jon.snow@example.com",
    phone: "+255123456789",
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    role: "Hygienist",
    email: "cersei.lannister@example.com",
    phone: "+255987654321",
  },
  {
    id: 3,
    lastName: "Stark",
    firstName: "Arya",
    role: "Nurse",
    email: "arya.stark@example.com",
    phone: "+255112233445",
  },
  {
    id: 4,
    lastName: "Targaryen",
    firstName: "Daenerys",
    role: "Receptionist",
    email: "daenerys.targaryen@example.com",
    phone: "+255445566778",
  },
  {
    id: 5,
    lastName: "Brown",
    firstName: "John",
    role: "Dentist",
    email: "john.brown@example.com",
    phone: "+255777888999",
  },
];

// Mock data for License Records
const licenseColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "licenseNumber", headerName: "License #", width: 150 },
  { field: "issueDate", headerName: "Issue Date", width: 120 },
  { field: "expiryDate", headerName: "Expiry Date", width: 120 },
  { field: "status", headerName: "Status", width: 100 },
];

const licenseRows: GridRowsProp = [
  {
    id: 1,
    licenseNumber: "DN-2024-001",
    issueDate: "2024-01-15",
    expiryDate: "2026-01-14",
    status: "Active",
  },
  {
    id: 2,
    licenseNumber: "HG-2023-005",
    issueDate: "2023-05-20",
    expiryDate: "2025-05-19",
    status: "Active",
  },
  {
    id: 3,
    licenseNumber: "NS-2022-012",
    issueDate: "2022-11-01",
    expiryDate: "2024-10-31",
    status: "Expired",
  },
];

const ClinicProfile = () => {
  const [staff, setStaff] = useState(rows);
  const [searchQuery, setSearchQuery] = useState("");
  const [licenseRecords] = useState(licenseRows);
  const theme = useTheme();

  const filteredStaff = useMemo(() => {
    return staff.filter((person) =>
      Object.values(person).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [staff, searchQuery]);

  return (
    <Box sx={{ padding: 4 }}>
      <Stack direction="row" spacing={3} alignItems="center" mb={4}>
        <Avatar
          alt="Clinic Logo"
          src="/static/images/avatar/1.jpg"
          sx={{ height: 50, width: 50 }}
        />
        <Stack direction="column">
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            Mpanda Dental Clinic
          </Typography>
          <Stack direction="row" alignItems="center">
            <LocationOnIcon
              sx={{ fontSize: "inherit", color: theme.palette.primary.main }}
            />
            <Typography variant="body2" color="text.secondary">
              P.O. Box 216, Mpanda - Katavi
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: theme.palette.primary.main }} />
          }
          aria-controls="clinic-info-content"
          id="clinic-info-header"
        >
          <Typography
            variant="h6"
            gutterBottom
            color={theme.palette.primary.main}
          >
            Clinic Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="column" spacing={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocalHospitalIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  Clinic Name
                </Typography>
              </Stack>
              <TextField
                id="clinic-name-input"
                size="small"
                value="Mpanda Dental Clinic"
                disabled
                fullWidth
                sx={{
                  marginTop: 0,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  Email Address
                </Typography>
              </Stack>

              <TextField
                id="email-address-input"
                size="small"
                value="mpanda.dental@example.com"
                disabled
                fullWidth
                sx={{
                  marginTop: 0,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  Phone Number
                </Typography>
              </Stack>
              <TextField
                id="phone-number-input"
                size="small"
                value="+255 782 329 852"
                disabled
                fullWidth
                sx={{
                  marginTop: 0,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  Address
                </Typography>
              </Stack>
              <TextField
                id="address-input"
                size="small"
                value="P.O. Box 216, Mpanda - Katavi"
                disabled
                fullWidth
                sx={{
                  marginTop: 0,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Registration Date
              </Typography>
              <TextField
                id="registration-date-input"
                size="small"
                value="17/04/2025"
                disabled
                fullWidth
                sx={{
                  marginTop: 0,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mt: 4 }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: theme.palette.primary.main }} />
          }
          aria-controls="staff-list-content"
          id="staff-list-header"
        >
          <Typography variant="h6" color={theme.palette.primary.main}>
            Staff List
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Search Staff"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
            size="small"
          />
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredStaff}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* License Records Accordion */}
      <Accordion sx={{ mt: 4 }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: theme.palette.primary.main }} />
          }
          aria-controls="license-records-content"
          id="license-records-header"
        >
          <Typography variant="h6" color={theme.palette.primary.main}>
            License Records
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={licenseRecords}
              columns={licenseColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ClinicProfile;
