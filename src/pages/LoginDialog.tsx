import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Session } from "@toolpad/core/AppProvider"; // Assuming Session is from @toolpad/core/AppProvider
import SignInSide from "./sign-in-side/SignInSide";

// Define the UserData interface as provided by the user
export interface UserData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  itExperience: string;
  birthYear: string;
  paymentStatus: string;
  password: string; // Note: In a real app, password should not be returned by the API
}

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  // New prop to handle successful login data externally
  onLoginSuccess?: (session: Session) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to handle actual login API call
const realAsyncGetSession = async (formData: FormData): Promise<Session> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const loginRequest = { email, password };

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (response.ok) {
      // HTTP status 200-299 indicates success
      const userData: UserData = await response.json();
      // Map UserData to the Session.user format
      return {
        user: {
          name: userData.fullName,
          email: userData.email,
          image: "https://placehold.co/40x40/007bff/ffffff?text=User", // Placeholder image
          // Assuming 'title' and 'entity_name' are not directly in UserData.
          // You might need to adjust this based on what your backend actually returns
          // or derive these properties if needed.
          title: "User", // Default or derive from userData if possible
          entity_name: "Application User", // Default or derive from userData if possible
        },
      };
    } else if (response.status === 401) {
      // Unauthorized status from backend
      const errorText = await response.text();
      throw new Error(errorText || "Invalid credentials.");
    } else {
      // Handle other HTTP errors (e.g., 500 server error)
      const errorText = await response.text();
      throw new Error(
        `Login failed: ${response.status} - ${errorText || "An unexpected error occurred"}`
      );
    }
  } catch (error) {
    console.error("Error during login API call:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Network error: Could not connect to the server. Please check your API_BASE_URL and server status."
      );
    }
    throw error; // Re-throw the original error
  }
};

const CustomSignInPage = ({
  onSignIn,
}: {
  onSignIn: (
    provider: string,
    formData: FormData,
    callbackUrl: string
  ) => Promise<any>;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const callbackUrl = "/"; // The URL to redirect to after successful login

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    setError(null); // Clear any previous errors
    setLoading(true);

    try {
      const result = await onSignIn("credentials", formData, callbackUrl);
      if (result?.error) {
        setError(result.error);
      }
      // If sign-in is successful, the parent component (LoginDialog) should handle navigation
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          variant="outlined"
          size="small"
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          variant="outlined"
          size="small"
        />
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          py: 1.5,
          borderRadius: "8px",
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#115293",
          },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>
    </form>
  );
};

export const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  onClose,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();

  const handleSignIn = async (
    provider: string,
    formData: FormData,
    callbackUrl: string
  ) => {
    try {
      const session = await realAsyncGetSession(formData); // Use the real API call
      if (session) {
        onLoginSuccess?.(session); // Call the new prop to pass session data up
        navigate(callbackUrl || "/", { replace: true }); // Redirect on success
        onClose(); // Close dialog
        return {};
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
    return {};
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 2,
          pl: 2,
          pt: 1,
          pb: 1,
        }}
      >
        Login
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2 }}>
        <SignInSide />
      </DialogContent>
    </Dialog>
  );
};

// This component is now designed to be imported and used within another component.
// It exports LoginDialog. Session management (SessionProvider and useSession)
// must be handled at a higher level in your application.
