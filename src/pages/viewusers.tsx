import React, { useState, useEffect, useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Define the TypeScript interface for a User based on your provided JSON structure
interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  itExperience: string;
  birthYear: string;
  academy: string | null;
  practice: string | null;
  inventory: string | null;
  createdAt: string;
  updatedAt: string;
  paymentStatus: string;
  password?: string; // Password might not be sent in GET requests, making it optional
  activities: any[]; // Assuming activities is an array, type can be refined if structure is known
}

// Custom function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
};

// Main App component
export default function ViewUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State for the edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({}); // State to hold form data for editing

  // Function to open the edit dialog and set the current user
  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    // Initialize form data with only the editable fields
    setEditFormData({
      academy: user.academy,
      practice: user.practice,
      inventory: user.inventory,
      paymentStatus: user.paymentStatus,
    });
    setEditDialogOpen(true);
  };

  // Function to close the edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentUser(null);
    setEditFormData({});
  };

  // Handle changes in the edit form fields
  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  // Handle saving the updated user data
  const handleSaveUser = async () => {
    if (!currentUser) return;

    setLoading(true); // Show loading indicator during update
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // Only send the fields that are being edited
          body: JSON.stringify({
            ...currentUser, // Keep existing non-editable fields
            ...editFormData, // Overlay with new editable fields
          }),
        }
      );

      if (!response.ok) {
        console.log(
          JSON.stringify({
            ...currentUser, // Keep existing non-editable fields
            ...editFormData, // Overlay with new editable fields
          })
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser: User = await response.json();

      // Update the users state with the modified user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleEditDialogClose(); // Close the dialog on success
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setSnackbarMessage(`Failed to update user: ${errorMessage}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Failed to update user:", err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 60 },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "password", headerName: "Password", width: 80 },
      { field: "email", headerName: "Email", width: 250 },
      { field: "phone", headerName: "Phone", width: 150 },
      { field: "address", headerName: "Address", width: 200 },
      { field: "itExperience", headerName: "IT Experience", width: 150 },
      { field: "birthYear", headerName: "Birth Year", width: 120 },
      { field: "academy", headerName: "Academy", width: 90 },
      { field: "practice", headerName: "Practice", width: 90 },
      { field: "inventory", headerName: "Inventory", width: 90 },
      { field: "paymentStatus", headerName: "Payment Status", width: 60 },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 180,
        // Use the custom formatDate function and access params.row.createdAt
        valueFormatter: (params: any) => formatDate(params.value),
      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        width: 180,
      },
      {
        field: "activities",
        headerName: "Activities",
        width: 120,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row as User)} // Cast params.row to User
            className="rounded-lg shadow-md"
          >
            Edit
          </Button>
        ),
      },
    ],
    [handleEditClick] // Re-render columns if handleEditClick changes (though it's stable)
  );

  // Effect to fetch users data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        setSnackbarMessage(`Failed to fetch users: ${errorMessage}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  // Memoized filtered users based on search text
  const filteredUsers = useMemo(() => {
    if (!searchText) {
      return users;
    }
    const lowercasedSearchText = searchText.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercasedSearchText) ||
        user.email.toLowerCase().includes(lowercasedSearchText) ||
        user.phone.toLowerCase().includes(lowercasedSearchText) ||
        user.address.toLowerCase().includes(lowercasedSearchText) ||
        user.itExperience.toLowerCase().includes(lowercasedSearchText) ||
        user.birthYear.toLowerCase().includes(lowercasedSearchText) ||
        user.academy?.toLowerCase().includes(lowercasedSearchText) ||
        user.practice?.toLowerCase().includes(lowercasedSearchText) ||
        user.inventory?.toLowerCase().includes(lowercasedSearchText) ||
        user.paymentStatus.toLowerCase().includes(lowercasedSearchText)
    );
  }, [users, searchText]);

  // Function to close the snackbar
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      className="min-h-screen flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900"
      sx={{
        fontFamily: "Inter, sans-serif", // Set font to Inter
      }}
    >
      <Box className="w-full max-w-5xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col gap-6">
        <Typography
          variant="h4"
          component="h1"
          className="text-center text-gray-800 dark:text-white font-bold mb-4"
        >
          User Management
        </Typography>

        {/* Search Input */}
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="rounded-lg mb-4"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.75rem", // Tailwind's rounded-lg
            },
          }}
        />

        {/* Conditional rendering for loading, error, or data */}
        {loading && !users.length ? ( // Only show loading if no users are loaded yet
          <Box className="flex justify-center items-center h-64">
            <CircularProgress />
            <Typography className="ml-4 text-gray-700 dark:text-gray-300">
              Loading users...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" className="rounded-lg">
            Error: {error}
          </Alert>
        ) : (
          <Box className="h-[600px] w-full">
            {" "}
            {/* Set a fixed height for DataGrid */}
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSizeOptions={[5, 10, 20]} // Options for rows per page
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              checkboxSelection
              disableRowSelectionOnClick
              className="rounded-lg shadow-md"
              sx={{
                "& .MuiDataGrid-root": {
                  borderRadius: "0.75rem",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f3f4f6", // Light gray background for headers
                  color: "#374151", // Darker text for headers
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  borderColor: "#e5e7eb", // Light border for cells
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "#f9fafb", // Alternate row background
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e0f2f7", // Hover effect
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle className="text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-t-lg">
          Edit User
        </DialogTitle>
        <DialogContent className="bg-white dark:bg-gray-800 p-6 flex flex-col gap-4">
          {currentUser && (
            <>
              <TextField
                label="Academy"
                name="academy"
                value={editFormData.academy || ""}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                className="rounded-lg"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
                  m: 1,
                }}
              />
              <TextField
                label="Practice"
                name="practice"
                value={editFormData.practice || ""}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                className="rounded-lg"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
                  m: 1,
                }}
              />
              <TextField
                label="Inventory"
                name="inventory"
                value={editFormData.inventory || ""}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                className="rounded-lg"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
                  m: 1,
                }}
              />
              <TextField
                label="Payment Status"
                name="paymentStatus"
                value={editFormData.paymentStatus || ""}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                className="rounded-lg"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
                  m: 1,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-100 dark:bg-gray-700 rounded-b-lg p-4">
          <Button
            onClick={handleEditDialogClose}
            color="secondary"
            variant="outlined"
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveUser}
            color="primary"
            variant="contained"
            className="rounded-lg"
            disabled={loading} // Disable save button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
