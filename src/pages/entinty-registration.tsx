import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import AppTheme from "../theme/AppTheme";
import Content from "./sign-in-side/Content";
import moment from "moment-timezone";
import { Box, Button, TextField, Typography } from "@mui/material";
import Header from "./Header";
export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [entity_name, setEntityName] = React.useState("");
  const [entity_address, setEntityAddress] = React.useState("");
  const [entity_phone, setEntityPhone] = React.useState("");
  const [entity_email, setEntityEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone_number, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [title, setTitle] = React.useState("");

  const registrationDateEAT = moment()
    .tz("Africa/Nairobi")
    .format("YYYY-MM-DDTHH:mm:ss");
  const handleSubmit = () => {
    fetch(`${API_BASE_URL}/dental_entities`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        entity_name: entity_name,
        entity_address: entity_address,
        entity_email: entity_email,
        entity_phone: entity_phone,
        entity_reg_date: registrationDateEAT,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          // Handle non-201 status codes (errors)
          console.error(
            "Error registering entity:",
            response.status,
            response.statusText
          );
          // Optionally, throw an error to be caught in the catch block
          throw new Error(
            `Entity registration failed with status: ${response.status}`
          );
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log("Entity registration successful:", data);
        }
      })
      .catch((error) => {
        console.error("Error during entity registration:", error);
        console.log(
          JSON.stringify({
            entity_name: entity_name,
            entity_address: entity_address,
            entity_email: entity_email,
            entity_phone: entity_phone,
          })
        );
      });

    fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: fullName,
        address: address,
        phone_number: phone_number,
        email: email,
        password: password,
        title: "Admin",
        entity_name: entity_name,
        registration_date: registrationDateEAT,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          // Handle non-201 status codes (errors)
          console.error(
            "Error registering user:",
            response.status,
            response.statusText
          );
          // Optionally, throw an error to be caught in the catch block
          throw new Error(
            `User registration failed with status: ${response.status}`
          );
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log("User registration successful:", data);
        }
        console.log(
          JSON.stringify({
            entity_name: entity_name,
            entity_address: entity_address,
            entity_email: entity_email,
            entity_phone: entity_phone,
          })
        );
        setEntityAddress("");
        setEntityName("");
        setEntityPhone("");
        setPhoneNumber(" ");
        setTitle("");
        setEntityEmail("");
        setPassword("");
        setFullName("");
        setEmail("");
        setAddress("");
      })
      .catch((error) => {
        console.error("Error during user registration:", error);
      });
  };
  return (
    <AppTheme {...props}>
      <Header />
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
            <Content path="/entity-registration" pathtype="" />{" "}
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
              noValidate
              autoComplete="off"
            >
              <Typography variant="h6" gutterBottom>
                Entity Information
              </Typography>
              <div>
                <TextField
                  id="entity-name"
                  label="Entity Name"
                  value={entity_name}
                  onChange={(e) => setEntityName(e.target.value)}
                  type="search"
                  variant="standard"
                />
                <TextField
                  id="entity-address"
                  label="Entity Address"
                  type="search"
                  value={entity_address}
                  onChange={(e) => setEntityAddress(e.target.value)}
                  variant="standard"
                />
                <TextField
                  id="entity-phone"
                  label="Entity Phone Number"
                  type="search"
                  onChange={(e) => setEntityPhone(e.target.value)}
                  value={entity_phone}
                  variant="standard"
                />
                <TextField
                  id="entity-email"
                  label="Entity Email Address"
                  type="search"
                  onChange={(e) => setEntityEmail(e.target.value)}
                  value={entity_email}
                  variant="standard"
                />
              </div>
              <br></br>

              <div>
                <Typography variant="h6" gutterBottom>
                  Administration Information
                </Typography>
                <TextField
                  id="fullname"
                  label="Full Name"
                  onChange={(e) => setFullName(e.target.value)}
                  type="search"
                  value={fullName}
                  variant="standard"
                />
                <TextField
                  id="address"
                  label="Physical Address"
                  type="search"
                  onChange={(e) => setAddress(e.target.value)}
                  variant="standard"
                  value={address}
                />
                <TextField
                  id="phone-number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  label="Phone Number"
                  type="search"
                  variant="standard"
                />
                <TextField
                  id="email"
                  label="Email Address"
                  value={email}
                  type="search"
                  onChange={(e) => setEmail(e.target.value)}
                  variant="standard"
                />
                <TextField
                  id="password"
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="search"
                  value={password}
                  variant="standard"
                />
              </div>
              <Button
                sx={{
                  textTransform: "none",
                }}
                variant="contained"
                onClick={handleSubmit}
              >
                Register
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </AppTheme>
  );
}
