import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography, // Added Typography for confirmation message
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"; // Added DeleteIcon

// Define the interface for a Payment object based on the provided Java entity and API response
interface Payment {
  id: number;
  type: string;
  amount: number;
  updateDate: string; // Storing as string as it comes from API, can be converted to Date if needed for sorting/filtering
  paymentWay: string;
}

// Main App component
export default function PaymentInfo() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State for Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // State for Add Dialog
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [newPayment, setNewPayment] = useState<
    Omit<Payment, "id" | "updateDate">
  >({
    type: "",
    amount: 0,
    paymentWay: "",
  });
  const [addError, setAddError] = useState<string | null>(null);

  // State for Delete Confirmation Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [paymentToDeleteId, setPaymentToDeleteId] = useState<number | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Function to fetch payments from the API
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Payment[] = await response.json();
      setPayments(data);
    } catch (err: any) {
      setError(`Failed to fetch payments: ${err.message}`);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments based on search term
  const filteredPayments = payments.filter((payment) =>
    Object.values(payment).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle opening the edit dialog
  const handleEditClick = (payment: Payment) => {
    setCurrentPayment(payment);
    setEditDialogOpen(true);
    setUpdateError(null); // Clear any previous update errors
  };

  // Handle closing the edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentPayment(null);
    setUpdateError(null); // Clear errors on close
  };

  // Handle saving edited payment
  const handleSaveEdit = async () => {
    if (!currentPayment) return; // Should not happen if dialog is open

    setUpdateError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payments/${currentPayment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // Exclude 'updateDate' from the payload as it's handled by the backend
          body: JSON.stringify({
            type: currentPayment.type,
            amount: currentPayment.amount,
            paymentWay: currentPayment.paymentWay,
            // id is in the URL, updateDate is handled by @PreUpdate in backend
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update payment: ${errorData.message || response.statusText}`
        );
      }

      // If update is successful, close dialog and re-fetch data
      handleEditDialogClose();
      fetchPayments(); // Re-fetch all payments to get the latest data
    } catch (err: any) {
      setUpdateError(`Error updating payment: ${err.message}`);
      console.error("Error updating payment:", err);
    }
  };

  // Handle opening the add new payment dialog
  const handleAddClick = () => {
    setNewPayment({ type: "", amount: 0, paymentWay: "" }); // Reset form
    setAddDialogOpen(true);
    setAddError(null); // Clear any previous add errors
  };

  // Handle closing the add new payment dialog
  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setAddError(null); // Clear errors on close
  };

  // Handle saving new payment
  const handleSaveNewPayment = async () => {
    setAddError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPayment), // Send new payment data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add payment: ${errorData.message || response.statusText}`
        );
      }

      // If add is successful, close dialog and re-fetch data
      handleAddDialogClose();
      fetchPayments(); // Re-fetch all payments to get the latest data
    } catch (err: any) {
      setAddError(`Error adding payment: ${err.message}`);
      console.error("Error adding payment:", err);
    }
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    setPaymentToDeleteId(id);
    setDeleteDialogOpen(true);
    setDeleteError(null); // Clear any previous delete errors
  };

  // Handle closing delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setPaymentToDeleteId(null);
    setDeleteError(null); // Clear errors on close
  };

  // Handle actual deletion
  const handleDeletePayment = async () => {
    if (paymentToDeleteId === null) return;

    setDeleteError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payments/${paymentToDeleteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        // Assuming backend sends a meaningful error response, otherwise use statusText
        const errorText = await response.text(); // Get raw text for generic error
        throw new Error(
          `Failed to delete payment: ${errorText || response.statusText}`
        );
      }

      // If deletion is successful, close dialog and re-fetch data
      handleDeleteDialogClose();
      fetchPayments(); // Re-fetch all payments to get the latest data
    } catch (err: any) {
      setDeleteError(`Error deleting payment: ${err.message}`);
      console.error("Error deleting payment:", err);
    }
  };

  // Columns definition for the DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "type", headerName: "Type", width: 90 },
    { field: "amount", headerName: "Amount", type: "number", width: 100 },
    {
      field: "updateDate",
      headerName: "Update Date",
      width: 100,
    },
    { field: "paymentWay", headerName: "Payment Way", flex: 1, minWidth: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 70, // Increased width to accommodate two buttons
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            color="primary"
            aria-label="edit payment"
            onClick={() => handleEditClick(params.row as Payment)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error" // Use error color for delete button
            aria-label="delete payment"
            onClick={() => handleDeleteClick(params.row.id as number)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-4 flex flex-col items-center min-h-screen bg-gray-100 font-sans">
      {/* Search Input and Add Button */}
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        className="w-full max-w-5xl flex justify-between items-center mb-6"
      >
        <TextField
          label="Search Payments"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white rounded-lg shadow-sm"
          InputProps={{
            className: "rounded-lg",
          }}
          size="small"
        />
        <Button
          sx={{ justifySelf: "flex-end" }}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
          onClick={handleAddClick} // Connect to new add handler
        >
          Add New Payment
        </Button>
      </Stack>

      {/* Loading, Error, or DataGrid */}
      <Box className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress />
            <span className="ml-4 text-gray-600">Loading payments...</span>
          </Box>
        ) : error ? (
          <Box className="p-4">
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={filteredPayments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]} // Options for rows per page
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            disableRowSelectionOnClick // Prevents row selection on click
            autoHeight // Adjusts height based on content
            className="rounded-lg"
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#fafafa",
              },
            }}
          />
        )}
      </Box>

      {/* Edit Payment Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Edit Payment
        </DialogTitle>
        <DialogContent className="p-6">
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          {currentPayment && (
            <Box
              justifyContent={"space-between"}
              className="flex flex-col gap-4"
            >
              <TextField
                label="ID"
                value={currentPayment.id}
                fullWidth
                disabled
                variant="outlined"
                sx={{ m: 1 }}
              />
              <TextField
                label="Type"
                value={currentPayment.type}
                onChange={(e) =>
                  setCurrentPayment({ ...currentPayment, type: e.target.value })
                }
                fullWidth
                variant="outlined"
                sx={{ m: 1 }}
              />
              <TextField
                label="Amount"
                type="number"
                value={currentPayment.amount}
                onChange={(e) =>
                  setCurrentPayment({
                    ...currentPayment,
                    amount: parseFloat(e.target.value),
                  })
                }
                fullWidth
                variant="outlined"
                sx={{ m: 1 }}
              />
              <TextField
                label="Payment Way"
                value={currentPayment.paymentWay}
                onChange={(e) =>
                  setCurrentPayment({
                    ...currentPayment,
                    paymentWay: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{ m: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200">
          <Button
            onClick={handleEditDialogClose}
            color="secondary"
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Payment Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Add New Payment
        </DialogTitle>
        <DialogContent className="p-6">
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addError}
            </Alert>
          )}
          <Box justifyContent={"space-between"} className="flex flex-col gap-4">
            <TextField
              label="Type"
              value={newPayment.type}
              onChange={(e) =>
                setNewPayment({ ...newPayment, type: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{ m: 1 }}
            />
            <TextField
              label="Amount"
              type="number"
              value={newPayment.amount}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  amount: parseFloat(e.target.value),
                })
              }
              fullWidth
              variant="outlined"
              sx={{ m: 1 }}
            />
            <TextField
              label="Payment Way"
              value={newPayment.paymentWay}
              onChange={(e) =>
                setNewPayment({ ...newPayment, paymentWay: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{ m: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200">
          <Button
            onClick={handleAddDialogClose}
            color="secondary"
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewPayment}
            variant="contained"
            color="primary"
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Confirm Deletion
        </DialogTitle>
        <DialogContent className="p-6">
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete payment with ID:{" "}
            <span className="font-bold">{paymentToDeleteId}</span>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200">
          <Button
            onClick={handleDeleteDialogClose}
            color="secondary"
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePayment}
            variant="contained"
            color="error" // Use error color for delete action
            className="rounded-lg bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
