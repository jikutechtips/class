import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Session } from "@toolpad/core/AppProvider";
import { SessionContext } from "./SessionContext";
import Groups3Icon from "@mui/icons-material/Groups";
import GroupsIcon from "@mui/icons-material/Groups";
import PendingIcon from "@mui/icons-material/Groups";
import CasesIcon from "@mui/icons-material/Cases";
import AddTaskIcon from "@mui/icons-material/AddTask";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import DomainIcon from "@mui/icons-material/Domain";
import PaymentIcon from "@mui/icons-material/Payment";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskIcon from "@mui/icons-material/Task";
import MedicationIcon from "@mui/icons-material/Medication";
import ClassIcon from "@mui/icons-material/Class";
import { Box, CircularProgress } from "@mui/material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

interface NavigationItem {
  title: string;
  icon?: React.ReactNode;
  segment?: string;
  visible?: boolean;
}

const BRANDING = {
  title: "",
  logo: (
    <img
      src="https://c.mamed.org/images/jikulogo" // Placeholder image URL
      alt="App Logo"
      className="w-10 h-10 rounded-full"
      onError={(e) => {
        e.currentTarget.src =
          "https://placehold.co/40x40/cccccc/000000?text=ERR";
      }} // Fallback
    />
  ),
};

// Define the session timeout in milliseconds (e.g., 1 hour)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 5 min

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null); // Store the timeout ID

  const handleSetSession = React.useCallback((newSession: Session | null) => {
    setSession(newSession);
    if (newSession) {
      localStorage.setItem("session", JSON.stringify(newSession));
    } else {
      localStorage.removeItem("session");
    }
  }, []);

  const resetTimeout = React.useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (session) {
      const newTimeoutId = setTimeout(() => {
        handleSetSession(null);
        navigate("/sign-in");
      }, SESSION_TIMEOUT);
      setTimeoutId(newTimeoutId);
    }
  }, [session, navigate, handleSetSession]);

  React.useEffect(() => {
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      try {
        const savedSession = JSON.parse(storedSession);
        setSession(savedSession);
      } catch (e) {
        console.error("Error parsing session from localStorage", e);
        localStorage.removeItem("session");
      }
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    resetTimeout();
  }, [resetTimeout]);

  const signIn = React.useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    localStorage.removeItem("session");
    navigate("/sign-in");
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [navigate, timeoutId]);

  const sessionContextValue = React.useMemo(
    () => ({ session, setSession: handleSetSession }),
    [session, handleSetSession]
  );

  const navigation = React.useMemo(() => {
    const baseNavigation: NavigationItem[] = [
      {
        title: "Dashboard",
        icon: <DashboardIcon sx={{ color: "green" }} />,
        visible: true,
      },
      {
        title: "Choose Class",
        icon: <ClassIcon sx={{ color: "green" }} />,
        segment: "chooseclass",
        visible: true,
      },
    ];

    if (session && session.user) {
      if (session.user.email === "alex@gmail.com") {
        return [
          {
            title: "Dashboard",
            icon: <DashboardIcon sx={{ color: "green" }} />,
            visible: true,
          },
          {
            title: "Choose Class",
            icon: <ClassIcon sx={{ color: "green" }} />,
            segment: "chooseclass",
            visible: true,
          },
          {
            title: "Admin",
            icon: <AdminPanelSettingsIcon sx={{ color: "green" }} />,
            segment: "admin",
          },
        ];
      } else if (session.user.email === "jikutechtips@gmail.com") {
      }
    }

    return baseNavigation;
  }, [session]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          size="lg"
          style={{
            color: "#676767",
            width: "80px",
            height: "80px",
          }}
        />
      </Box>
    );
  }

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider
        navigation={[
          {
            kind: "header",
            title: "Main items",
          },
          ...navigation,
        ]}
        branding={BRANDING}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  );
}
