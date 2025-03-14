import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { SessionContext, useSession } from "../SessionContext";
import moment from "moment-timezone";
import AppTheme from "../theme/AppTheme";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function AddClients(props: { disableCustomTheme?: boolean }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const [entity_name, setEntityName] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone_number, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [office, setOffice] = React.useState("");
  const registrationDateEAT = moment()
    .tz("Africa/Nairobi")
    .format("DD/MM/YYYY, h:mm:ss A");
  const handleSubmit = () => {
    fetch(`${API_BASE_URL}/clients`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: fullName,
        address: address,
        phone: phone_number,
        email: email,
        password: password,
        title: title.toLowerCase(),
        office: office,
        entity_name: session?.user?.entity_name,
      }),
    })
      .then((response) => {
        if (response.status == 201) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
        }
        setEntityName("");
        setPhoneNumber(" ");
        setTitle("");
        setPassword("");
        setFullName("");
        setEmail("");
        setAddress("");
      });
  };
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
            marginTop: "max(0px - var(--template-frame-height, 0px), 0px)",
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
              mt: 0,
            }}
            spacing={2}
          >
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "36ch", marginTop: 0 },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
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
                  id="title"
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  type="search"
                  value={title}
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
                <TextField
                  id="domain"
                  label="Institute/Office"
                  value={office}
                  type="search"
                  onChange={(e) => setOffice(e.target.value)}
                  variant="standard"
                />
              </div>
              <Button
                sx={{
                  textTransform: "none",
                  float: "center",
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
