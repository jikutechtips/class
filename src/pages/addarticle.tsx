import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";

// Main App component
export default function AddArticle() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Construct the article object from state
    const article = { title, body: body.trim(), type };

    try {
      // Make the POST request to the API
      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: JSON.stringify(article), // Convert the article object to a JSON string
      });

      // Check if the request was successful
      if (response.ok) {
        const savedArticle = await response.json(); // Parse the JSON response
        console.log("Article created successfully:", savedArticle);
        setSnackbarMessage("Article created successfully!");
        setSnackbarSeverity("success");
        // Clear the form fields after successful submission
        setTitle("");
        setBody("");
        setType("");
      } else {
        // Handle HTTP errors
        const errorData = await response.json();
        console.error("Failed to create article:", response.status, errorData);
        setSnackbarMessage(
          `Failed to create article: ${errorData.message || response.statusText}`
        );
        setSnackbarSeverity("error");
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error("Error submitting form:", error);
      setSnackbarMessage(
        `Error submitting form: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true); // Open the snackbar to show feedback
    }
  };

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
      className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900"
      sx={{
        fontFamily: "Inter, sans-serif", // Set font to Inter
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col gap-6"
      >
        {/* Title Input */}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-lg"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.75rem", // Tailwind's rounded-lg
            },
            mb: 3,
          }}
        />

        {/* Body Input */}
        <TextField
          label="Body"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="rounded-lg"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.75rem", // Tailwind's rounded-lg
            },
            mb: 3,
          }}
        />

        {/* Type Select Input */}
        <FormControl fullWidth variant="outlined" className="rounded-lg">
          <InputLabel id="article-type-label">Type</InputLabel>
          <Select
            labelId="article-type-label"
            id="article-type-select"
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value as string)}
            required
            className="rounded-lg"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.75rem", // Tailwind's rounded-lg
              },
              mb: 3,
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="utangulizi">Utangulizi</MenuItem>
            <MenuItem value="academy">Academy</MenuItem>
            <MenuItem value="pratice">Practice</MenuItem>
            <MenuItem value="inventory">Inventory</MenuItem>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          sx={{
            borderRadius: "0.75rem", // Tailwind's rounded-lg
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", // Example gradient
            "&:hover": {
              background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
            },
          }}
        >
          Create Article
        </Button>
      </Box>

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
