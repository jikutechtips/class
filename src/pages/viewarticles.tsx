import React, { useState, useEffect, useCallback } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton, // Added IconButton for a more compact action button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Define the Article interface based on your Java entity and API response
interface Article {
  id: number;
  title: string;
  body: string;
  type: string;
  postDate: string; // Assuming ISO 8601 string format
}

// Base URL for your API

// Main App component
export default function ViewArticles() {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/articles`;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    body: string;
    type: string;
  }>({
    title: "",
    body: "",
    type: "",
  });
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Function to fetch articles from the API
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Article[] = await response.json();
      setArticles(data);
    } catch (err: any) {
      console.error("Failed to fetch articles:", err);
      setError(`Failed to load articles: ${err.message}`);
      showSnackbar(`Failed to load articles: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle opening the edit dialog
  const handleEditClick = useCallback((article: Article) => {
    setSelectedArticle(article);
    setEditForm({
      title: article.title,
      body: article.body,
      type: article.type,
    });
    setOpenEditDialog(true);
  }, []);

  // Handle closing the edit dialog
  const handleEditDialogClose = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedArticle(null);
  }, []);

  // Handle changes in the edit form fields
  const handleEditFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Handle saving the edited article
  const handleSaveEdit = useCallback(async () => {
    if (!selectedArticle) return;

    setLoading(true); // Indicate loading for the update operation
    try {
      const updatedArticle = { ...selectedArticle, ...editForm };
      const response = await fetch(`${API_BASE_URL}/${selectedArticle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update article: ${errorData.message || response.statusText}`
        );
      }

      showSnackbar("Article updated successfully!", "success");
      handleEditDialogClose();
      fetchArticles(); // Re-fetch articles to update the DataGrid
    } catch (err: any) {
      console.error("Failed to update article:", err);
      showSnackbar(`Error updating article: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [selectedArticle, editForm, handleEditDialogClose, fetchArticles]);

  // Handle opening the delete confirmation dialog
  const handleDeleteClick = useCallback((article: Article) => {
    setArticleToDelete(article);
    setOpenDeleteConfirm(true);
  }, []);

  // Handle closing the delete confirmation dialog
  const handleDeleteConfirmClose = useCallback(() => {
    setOpenDeleteConfirm(false);
    setArticleToDelete(null);
  }, []);

  // Handle confirming and performing the delete operation
  const handleConfirmDelete = useCallback(async () => {
    if (!articleToDelete) return;

    setLoading(true); // Indicate loading for the delete operation
    try {
      const response = await fetch(`${API_BASE_URL}/${articleToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete article: ${response.statusText}`);
      }

      showSnackbar("Article deleted successfully!", "success");
      handleDeleteConfirmClose();
      fetchArticles(); // Re-fetch articles to update the DataGrid
    } catch (err: any) {
      console.error("Failed to delete article:", err);
      showSnackbar(`Error deleting article: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [articleToDelete, handleDeleteConfirmClose, fetchArticles]);

  // Snackbar utility function
  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const handleSnackbarClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbarOpen(false);
    },
    []
  );

  // Define DataGrid columns
  const columns: GridColDef<Article>[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "title", headerName: "Title", flex: 1, minWidth: 150 },
    { field: "body", headerName: "Body", flex: 2, minWidth: 200 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "postDate", headerName: "Post Date", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params: GridRowParams<Article>) => [
        // Using IconButton directly instead of GridActionsCellItem
        <IconButton
          key="edit"
          aria-label="edit"
          onClick={() => handleEditClick(params.row)}
          color="primary"
        >
          <EditIcon />
        </IconButton>,
        <IconButton
          key="delete"
          aria-label="delete"
          onClick={() => handleDeleteClick(params.row)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
        {loading && (
          <Box className="flex justify-center items-center h-48">
            <CircularProgress />
            <Typography variant="h6" className="ml-4">
              Loading Articles...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" className="w-full mb-4">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Box className="w-full h-[600px] rounded-lg overflow-hidden">
            {" "}
            {/* Fixed height for DataGrid */}
            <DataGrid
              rows={articles}
              columns={columns}
              getRowId={(row) => row.id} // Ensure DataGrid uses 'id' as the unique key
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              className="rounded-lg"
            />
          </Box>
        )}
      </Box>

      {/* Edit Article Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-blue-500 text-white rounded-t-lg font-inter">
          Edit Article
        </DialogTitle>
        <DialogContent className="p-6">
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.title}
            onChange={handleEditFormChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            name="body"
            label="Body"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editForm.body}
            onChange={handleEditFormChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            name="type"
            label="Type"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.type}
            onChange={handleEditFormChange}
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200">
          <Button
            onClick={handleEditDialogClose}
            color="secondary"
            variant="outlined"
            className="rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            color="primary"
            variant="contained"
            className="rounded-md"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleDeleteConfirmClose}
        maxWidth="xs"
      >
        <DialogTitle className="bg-red-500 text-white rounded-t-lg font-inter">
          Confirm Delete
        </DialogTitle>
        <DialogContent className="p-6">
          <Typography>
            Are you sure you want to delete the article "
            {articleToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200">
          <Button
            onClick={handleDeleteConfirmClose}
            color="secondary"
            variant="outlined"
            className="rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            className="rounded-md"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
    </Container>
  );
}
