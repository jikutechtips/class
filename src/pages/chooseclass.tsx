import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Avatar,
  DialogContent,
  TextField, // Import TextField
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PersonAdd,
  Login,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import Facebook from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Instagram from "@mui/icons-material/Instagram";
import CheckCircle from "@mui/icons-material/CheckCircle";
// Removed: import { useNavigate } from "react-router"; // No longer needed
import { cyan } from "@mui/material/colors";
import DashboardPage1 from "./dashboard"; // Renamed import as per request
import Root from "./homep"; // Assuming Root is a parent component or similar
import { useSession } from "../SessionContext";

interface Payment {
  id: number;
  type: string;
  updateDate: string;
  amount: number;
  paymentWay: string;
}

const ChooseClass = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { session } = useSession();
  const theme = useTheme();
  const [appBarColor, setAppBarColor] = useState("transparent");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [cardDialogContent, setCardDialogContent] = useState({
    title: "",
    description: "",
  });
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false); // State for the new dialog
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  // Removed: const navigate = useNavigate(); // No longer needed
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New states for conditional rendering of DashboardPage1
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardStage, setDashboardStage] = useState<string | null>(null);

  const fetchArticles = async (stageName: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payments/type/${stageName}`
      );
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const data: Payment[] = await response.json();
      setPayments(data);
      console.log(data);
    } catch (err: any) {
      setError(
        err.message == 404 ? "No Data " : `Error ${err.message} contact Admin`
      );
      console.error("Error fetching payments data :", err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenPaymentDialog = (stageName: string) => {
    fetchArticles(stageName);
    setOpenPaymentDialog(true);
  };
  const handlepaymentClose = () => {
    setOpenPaymentDialog(false);
  };
  const handleStageSelect = (stageName: string) => {
    setSelectedStage(stageName);
    setIsLoggedIn(true); // Simulate login
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("selectedStage", stageName);

    // Determine user's access based on session data
    // Note: The logic `session?.user?.academy != null ? "academy" : session?.user?.academy`
    // means if `session?.user?.academy` is not null, it becomes "academy", otherwise it remains null.
    // This assumes "academy" is the literal string to check against.
    const academy =
      session?.user?.academy != null ? "academy" : session?.user?.academy;
    const practice =
      session?.user?.practice != null ? "practice" : session?.user?.practice;
    const inventory =
      session?.user?.inventory != null ? "inventory" : session?.user?.inventory;

    // Check if the selected stage is accessible
    if (
      "utangulizi" === stageName.toLowerCase() ||
      academy === stageName.toLowerCase() ||
      practice === stageName.toLowerCase() ||
      inventory === stageName.toLowerCase()
    ) {
      setDashboardStage(stageName); // Set the stage to pass to DashboardPage1
      setShowDashboard(true); // Show the DashboardPage1 component
      console.log(academy, inventory, practice);
    } else {
      // Open payment dialog for inaccessible stages
      handleOpenPaymentDialog(stageName);
      setShowDashboard(false); // Ensure Dashboard is not shown
      console.log(academy, inventory, practice);
    }
  };

  const cardData = [
    {
      title: "Utangulizi",
      description: "",
      route: "/dashboard",
    },
    {
      title: "Academy",
      description: "",
      route: "/dashboard",
    },
    {
      title: "Practice",
      description: ``,
      route: "/dashboard",
    },
    {
      title: "Inventory",
      description: "",
      route: "/dashboard",
    },
  ];

  return (
    <>
      {/* Conditionally render DashboardPage1 or the ChooseClass content */}
      {showDashboard && dashboardStage ? (
        <DashboardPage1 stageName={dashboardStage} />
      ) : (
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              marginTop: "64px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingX: { xs: 2, sm: 4, md: 8 },
              paddingTop: 4,
              paddingBottom: 8,
            }}
          >
            <Grid container spacing={4} justifyContent="center">
              {cardData.map((card, index) => (
                <Grid item key={index} xs={12} md={6} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                      cursor: "pointer", // Add cursor style
                    }}
                    onClick={() => handleStageSelect(card.title)} // Add onClick
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h5"
                        component="h4"
                        sx={{ fontWeight: 600, mb: 0 }}
                      >
                        {card.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Card Dialog (remains outside conditional rendering of main content) */}
          <Dialog
            open={openCardDialog}
            onClose={() => setOpenCardDialog(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>{cardDialogContent.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 4, p: 2 }}>
                <Typography variant="body1">
                  {cardDialogContent.description}
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Payment Dialog (remains outside conditional rendering of main content) */}
          <Dialog
            open={openPaymentDialog}
            onClose={handlepaymentClose}
            maxWidth="md"
          >
            <DialogTitle>{`Fanya Malipo ,  Ili Kuendelea Hatua ya ${selectedStage}`}</DialogTitle>
            <DialogContent>
              {loading ? (
                <Typography>Inapakia maelezo ya malipo...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : payments.length > 0 ? (
                <Stack spacing={2} direction={{ xs: "column", md: "column" }}>
                  <Typography variant="body1">
                    {`Kiwango ${payments[0].amount}`}
                  </Typography>{" "}
                  <Typography variant="body1">
                    {`Jinsi ya Kulipia ${payments[0].paymentWay}`}
                  </Typography>
                </Stack>
              ) : (
                <Typography>
                  Hakuna maelezo ya malipo yaliyopatikana kwa hatua hii.
                </Typography>
              )}
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default ChooseClass;
