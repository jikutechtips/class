"use client";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GymRecord } from "./GymRecord";

const AddDoctor = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [records, setRecords] = React.useState<GymRecord[]>([]);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [contacts, setContacts] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    fetch(`${API_BASE_URL}/1/jiku/doctors`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: name,
        domain: domain,
        phone: contacts,
        address: address,
        email: email,
        date: "null",
        status: "null",
        gender: gender,
        password: password,
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
          setRecords([...records, data]);
        }
      });
  };
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <Container maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "50px",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
              <LockOutlined />
            </Avatar> */}
            <Typography variant="h5">
              <span className="menu2">Doctor Registration</span>
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="domain"
                    required
                    fullWidth
                    id="domain"
                    label="Domain"
                    autoFocus
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="contacts"
                    required
                    fullWidth
                    type="number"
                    id="phone"
                    label="Phone Number"
                    autoFocus
                    value={contacts}
                    onChange={(e) => setContacts(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    autoFocus
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="gender"
                    required
                    fullWidth
                    id="gender"
                    label="Gender"
                    autoFocus
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddDoctor;
