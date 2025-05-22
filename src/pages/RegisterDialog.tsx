import React, { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { cyan } from "@mui/material/colors";

interface UserData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  itExperience: string;
  birthYear: string;
  paymentStatus: string;
  password: string;
}

const paymentStatusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Grace", value: "GRACE" },
  { label: "Refunded", value: "REFUNDED" },
];

const CreateUserPage = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    itExperience: "",
    birthYear: "",
    paymentStatus: "PENDING",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePaymentStatusChange = (value: string | null) => {
    setUserData({ ...userData, paymentStatus: value || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log(JSON.stringify(userData));
      const response = await fetch(`http://localhost:8080/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      const newUser = await response.json();
      console.log("User created successfully:", newUser);
      setSuccess(true);
      setUserData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        itExperience: "",
        birthYear: "1998",
        paymentStatus: "PENDING",
        password: "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        bgcolor: cyan[900], // Apply cyan[900] to the background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: "md" }}>
        <CardContent sx={{ padding: (theme) => theme.spacing(3) }}>
          <form style={{ gap: 20 }} onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                Full Name
              </label>
              <TextField
                type="text"
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                sx={{ mt: 1, width: "100%" }}
                InputProps={{
                  style: {
                    backgroundColor: "white", // Input background
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                Phone
              </label>
              <TextField
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                required
                placeholder="123-456-7890"
                sx={{ mt: 1, width: "100%" }}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                Email
              </label>
              <TextField
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@example.com"
                sx={{ mt: 1, width: "100%" }}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </div>
            <div>
              <label
                htmlFor="address"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                Address
              </label>
              <TextareaAutosize
                id="address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                required
                placeholder="123 Main St"
                style={{
                  marginTop: 1,
                  width: "100%",
                  minHeight: "100px",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  outline: "none",
                  backgroundColor: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="itExperience"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                IT Experience (Years)
              </label>
              <TextField
                type="text"
                id="itExperience"
                name="itExperience"
                value={userData.itExperience}
                onChange={handleChange}
                required
                placeholder="e.g awali, msingi, mtaalamu"
                sx={{ mt: 1, width: "100%" }}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </div>
            <div>
              <label
                htmlFor="birthYear"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                Birth Year
              </label>
              <TextField
                type="text"
                id="birthYear"
                name="birthYear"
                value={userData.birthYear}
                onChange={handleChange}
                required
                placeholder="1999"
                sx={{ mt: 1, width: "100%" }}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "text.primary",
                }}
              >
                Password
              </label>
              <TextField
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
                placeholder="Enter Password"
                sx={{ mt: 1, width: "100%" }}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </div>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Something went Wrong !!</AlertTitle>
                <p>{error}</p>
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <AlertTitle>Success</AlertTitle>
                <p>User created successfully!</p>
              </Alert>
            )}

            <div>
              <Button
                type="submit"
                sx={{
                  width: "100%",
                  mt: 2,
                  bgcolor: cyan[700], // Button background color
                  color: "white", // Button text color
                  "&:hover": {
                    bgcolor: cyan[900], // Darker shade on hover
                  },
                  padding: (theme) => theme.spacing(1.5),
                  borderRadius: "0.375rem",
                  fontSize: "1.2rem",
                }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CreateUserPage;
