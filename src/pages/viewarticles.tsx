import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  IconButton,
  MenuItem, // Added MenuItem for select options
  Select, // Added Select for pagination options
  InputLabel, // Added InputLabel for the select field
  FormControl, // Added FormControl to group label and select
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

  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State for rows per page, initialized to 10 as per DataGrid's default
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

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
  }, [API_BASE_URL]); // Added API_BASE_URL to dependency array

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
  }, [
    selectedArticle,
    editForm,
    handleEditDialogClose,
    fetchArticles,
    API_BASE_URL,
  ]); // Added API_BASE_URL to dependency array

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
  }, [articleToDelete, handleDeleteConfirmClose, fetchArticles, API_BASE_URL]); // Added API_BASE_URL to dependency array

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

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery) {
      return articles;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerCaseQuery) ||
        article.body.toLowerCase().includes(lowerCaseQuery) ||
        article.type.toLowerCase().includes(lowerCaseQuery) ||
        article.postDate.toLowerCase().includes(lowerCaseQuery) // Also search in postDate
    );
  }, [articles, searchQuery]);

  // Handle change in rows per page
  const handleRowsPerPageChange = useCallback((event: any) => {
    setRowsPerPage(Number(event.target.value));
  }, []);

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
    <Container maxWidth="lg" className="py-8 font-inter">
      <Box className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
        <Typography
          variant="h4"
          component="h1"
          className="mb-6 text-blue-700 font-bold"
        >
          Article Management
        </Typography>

        {/* Search and Pagination Controls */}
        <Box className="w-full flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <TextField
            label="Search Articles"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 md:w-1/3 rounded-md"
            InputProps={{
              className: "rounded-md",
            }}
          />
          <FormControl
            variant="outlined"
            className="w-full sm:w-auto min-w-[120px] rounded-md"
          >
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              label="Rows per page"
              className="rounded-md"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box className="flex justify-center items-center h-48">
            <CircularProgress />
            <Typography variant="h6" className="ml-4">
              Loading Articles...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" className="w-full mb-4 rounded-md">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Box className="w-full h-[600px] rounded-lg overflow-hidden">
            <DataGrid
              rows={filteredArticles} // Use filtered articles here
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: rowsPerPage, page: 0 }, // Use rowsPerPage state
                },
              }}
              // Removed pageSizeOptions as we are now controlling it via a separate select
              // pageSizeOptions={[5, 10, 20]} // This is now handled by the custom Select component
              disableRowSelectionOnClick
              className="rounded-lg shadow-inner"
              // Add a key to force re-render when rowsPerPage changes, if needed (though DataGrid handles it)
              key={rowsPerPage}
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
            className="mb-4 rounded-md"
            InputProps={{
              className: "rounded-md",
            }}
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
            className="mb-4 rounded-md"
            InputProps={{
              className: "rounded-md",
            }}
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
            className="rounded-md"
            InputProps={{
              className: "rounded-md",
            }}
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
            <span className="font-semibold">{articleToDelete?.title}</span>"?
            This action cannot be undone.
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
          className="rounded-md"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
