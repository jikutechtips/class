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
import { useNavigate } from "react-router";
import { cyan } from "@mui/material/colors";
import DashboardPage from "./dashboard";
import Root from "./homep";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payments/type/${"inventory"}`
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
  const handleStageSelect = (stageName: string) => {
    fetchArticles();
    setSelectedStage(stageName);
    setIsLoggedIn(true); // Simulate login
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("selectedStage", stageName);
    const academy =
      session?.user?.academy != null ? "academy" : session?.user?.academy;
    const practice =
      session?.user?.practice != null ? "practice" : session?.user?.practice;
    const inventory =
      session?.user?.inventory != null ? "inventory" : session?.user?.inventory;
    if ("utangulizi" == stageName.toLowerCase()) {
      navigate(`/dashboard?stage=${stageName}`);
      console.log(academy, inventory, practice);
    } else if (academy == stageName.toLowerCase()) {
      navigate(`/dashboard?stage=${stageName}`);
    } else if (practice == stageName.toLowerCase()) {
      navigate(`/dashboard?stage=${stageName}`);
    } else if (inventory == stageName.toLowerCase()) {
      navigate(`/dashboard?stage=${stageName}`);
    } else {
      setOpenPaymentDialog(true);
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
      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>{`Fanya Malipo ,  Ili Kuendelea Hatua ya ${selectedStage}`}</DialogTitle>
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
  );
};

export default ChooseClass;
