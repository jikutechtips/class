import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Content from "./Content";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { SignInCard } from "./SignInCard";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useSession } from "../../SessionContext";
import { useNavigate } from "react-router-dom";
import User from "../../interfaces/User";
import { Session } from "@toolpad/core/AppProvider";

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("SignInSide component rendered");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false); // Add loading state
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [userFullName, setFullName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
    setLoading(true); // Set loading to true
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/users/${formData.get("email")}`, {
        method: "GET",
      })
        .then(async (response) => {
          if (!response.ok) {
            // const e = await response.json();
            // setErrorMessage(e.message);
            // throw new Error(e.message);
            fetch(`${API_BASE_URL}/clients/-/${formData.get("email")}`, {
              method: "GET",
            })
              .then(async (response) => {
                if (!response.ok) {
                  const e = await response.json();
                  setErrorMessage(e.message);
                  throw new Error(e.message);
                } // No need to set users state here, we only care about email
                return response.json(); // Parse the response as JSON
              })

              .then((data: User) => {
                // Assuming the response structure has an "email" property

                if (data && data.fullName) {
                  setFullName(data.fullName);
                  console.log(data.email);
                  if (formData.get("password") === data.password) {
                    resolve({
                      user: {
                        name: data.fullName,
                        email: formData.get("email") || "",
                        image:
                          "https://clinic.mamed.co.tz/assets/images/logo_32_dark.png",
                        title: data.title,
                        entity_name: data.entity_name,
                      },
                    });
                  }
                  reject(new Error("Incorrect credentials."));
                }
              })

              .catch((error) => {
                console.error("Error fetching user data:", error);

                reject(error);
              })

              .finally(() => {
                // Update state with retrieved email
              });
          } // No need to set users state here, we only care about email
          return response.json(); // Parse the response as JSON
        })

        .then((data: User) => {
          // Assuming the response structure has an "email" property

          if (data && data.fullName) {
            console.log(data.email);
            setFullName(data.fullName);
            if (formData.get("password") === data.password) {
              resolve({
                user: {
                  name: data.fullName,
                  email: formData.get("email") || "",
                  image:
                    "https://clinic.mamed.co.tz/assets/images/logo_32_dark.png",
                  title: data.title,
                  entity_name: data.entity_name,
                },
              });
            }
            reject(new Error("Incorrect credentials."));
          }
        })

        .catch((error) => {
          console.error("Error fetching user data:", error);

          reject(error);
        })

        .finally(() => {
          // Update state with retrieved email
        });
    });
  };
  const { setSession } = useSession();
  const navigate = useNavigate();
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "center",
            height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
            marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
            minHeight: "100%",
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: "auto",
          }}
        >
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            sx={{
              justifyContent: "center",
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: "auto",
            }}
            spacing={2}
          >
            <SignInPage
              // sx={{ backgroundColor: "background.paper" }}
              providers={[{ id: "credentials", name: "Credentials" }]}
              signIn={async (provider, formData, callbackUrl) => {
                // Demo session
                try {
                  const session = await fakeAsyncGetSession(formData);
                  if (session) {
                    setSession(session);
                    navigate(callbackUrl || `${"/demo"}`, { replace: true });
                    return {};
                  }
                } catch (error) {
                  return {
                    error:
                      error instanceof Error
                        ? error.message
                        : "An error occurred",
                  };
                }
                return {};
              }}
            />
            <Content path="/entity-registration" pathtype="Register" />
          </Stack>
        </Stack>
      </Stack>
    </AppTheme>
  );
}
