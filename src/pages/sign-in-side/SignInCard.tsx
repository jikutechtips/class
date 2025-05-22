import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";
import { SignInPage } from "@toolpad/core/SignInPage";
import type { Session } from "@toolpad/core/AppProvider";
import { useSession } from "../../SessionContext";
import User from "../../interfaces/User";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export const SignInCard = function SignInCard(props: any) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };
  const [userFullName, setFullName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:8080/users/${formData.get("email")}`, {
        method: "GET",
      })
        .then(async (response) => {
          if (!response.ok) {
            // const e = await response.json();
            // setErrorMessage(e.message);
            // throw new Error(e.message);
            fetch(`http://localhost:8080/clients/-/${formData.get("email")}`, {
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
    <>
      <SignInPage
        // sx={{ backgroundColor: "background.paper" }}
        providers={[{ id: "credentials", name: "Credentials" }]}
        signIn={async (provider, formData, callbackUrl) => {
          // Demo session
          try {
            const session = await fakeAsyncGetSession(formData);
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
    </>
  );
};
