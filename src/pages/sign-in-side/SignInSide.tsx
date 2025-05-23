import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Content from "./Content";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { SignInCard } from "./SignInCard"; // Assuming this is a component you use
import { SignInPage } from "@toolpad/core/SignInPage";
import { useSession } from "../../SessionContext"; // Keep this import as per user's original code
import { useNavigate } from "react-router-dom";
import { Session } from "@toolpad/core/AppProvider";
import { User } from "../../interfaces/User";

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("SignInSide component rendered");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false); // Add loading state
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [, setFullName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Replaced fakeAsyncGetSession with realAsyncGetSession
  const realAsyncGetSession = async (formData: FormData): Promise<Session> => {
    setLoading(true); // Set loading to true
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setLoading(false);
      throw new Error("Email and password are required.");
    }

    const loginRequest = { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        // POST request to /login
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      if (response.ok) {
        // HTTP status 200-299 indicates success
        const userData: User = await response.json(); // Use the User interface
        setFullName(userData.fullName); // Update user full name state
        setLoading(false);

        return {
          user: {
            name: userData.fullName,
            email: userData.email,
            image: "https://placehold.co/40x40/007bff/ffffff?text=User", // Placeholder image
            title: userData.title, // Use title from User data
            entity_name: userData.entity_name,
            phone: userData.phone,
            address: userData.address,
            itExperience: userData.itExperience,
            birthYear: userData.birthYear,
            academy: userData.academy,
            practice: userData.practice,
            inventory: userData.inventory,
            createdAt: userData.createdAt,
            updateAt: userData.updateAt,
            paymentStatus: userData.paymentStatus,
          },
        };
      } else if (response.status === 401) {
        // Unauthorized status from backend
        setLoading(false);
        const errorText = await response.text();
        setErrorMessage(errorText || "Invalid credentials.");
        throw new Error(errorText || "Invalid credentials.");
      } else {
        // Handle other HTTP errors (e.g., 500 server error)
        setLoading(false);
        const errorText = await response.text();
        setErrorMessage(
          `Login failed: ${response.status} - ${errorText || "An unexpected error occurred"}`
        );
        throw new Error(
          `Login failed: ${response.status} - ${errorText || "An unexpected error occurred"}`
        );
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error during login API call:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setErrorMessage(
          "Network error: Could not connect to the server. Please check your API_BASE_URL and server status."
        );
        throw new Error(
          "Network error: Could not connect to the server. Please check your API_BASE_URL and server status."
        );
      }
      setErrorMessage(
        error.message || "An unexpected error occurred during login."
      );
      throw error; // Re-throw the original error
    }
  };

  const { setSession } = useSession();
  const navigate = useNavigate();

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInPage
        // sx={{ backgroundColor: "background.paper" }}
        providers={[{ id: "credentials", name: "Credentials" }]}
        signIn={async (provider, formData, callbackUrl) => {
          // Demo session
          try {
            const session = await realAsyncGetSession(formData); // Using realAsyncGetSession
            if (session) {
              setSession(session);
              navigate(callbackUrl || `${"/"}`, { replace: true });
              return {};
            }
          } catch (error) {
            return {
              error:
                error instanceof Error ? error.message : "An error occurred",
            };
          }
          return {};
        }}
      />
    </AppTheme>
  );
}
