import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation, Session } from "@toolpad/core/AppProvider";
import { SessionContext, useSession } from "./SessionContext";
import Groups3Icon from "@mui/icons-material/Groups";
import GroupsIcon from "@mui/icons-material/Groups";
import PendingIcon from "@mui/icons-material/Groups";
import CasesIcon from "@mui/icons-material/Cases";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DoneIcon from "@mui/icons-material/Done";
import InfoIcon from "@mui/icons-material/Info";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import DomainIcon from "@mui/icons-material/Domain";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskIcon from "@mui/icons-material/Task";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import MedicationIcon from "@mui/icons-material/Medication";
interface NavigationItem {
  title: string;
  icon?: React.ReactNode;
  segment?: string;
  visible?: boolean;
}

const BRANDING = {
  title: "Dental Laboratory",
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate("/sign-in");
  }, [navigate]);

  const sessionContextValue = React.useMemo(
    () => ({ session, setSession }),
    [session, setSession]
  );
  const navigation = React.useMemo(() => {
    // Use useMemo directly here

    const baseNavigation: NavigationItem[] = [
      {
        title: "Dashboard",
        icon: <DashboardIcon sx={{ color: "green" }} />,
        visible: true,
      },
      {
        title: "Dental Entities",
        icon: <DomainIcon sx={{ color: "green" }} />,
        segment: "orders",
        visible: true,
      },
    ];

    if (session && session.user) {
      if (session.user.title === "manager") {
        // Access role directly from session.user
        return [
          ...baseNavigation,
          {
            title: "Users",
            icon: <Groups3Icon sx={{ color: "green" }} />,
            segment: "page1",
            visible: true, // Managers can see Users
          },
          {
            title: "Demo",
            icon: <Groups3Icon sx={{ color: "green" }} />,
            segment: "demo",
            visible: true, // Managers can see Demo
          },
        ];
      } else if (session.user.title === "technician") {
        return [
          {
            title: "Cases",
            icon: <Groups3Icon sx={{ color: "green" }} />,
            segment: "tech",
            children: [
              {
                title: "Pending",
                icon: <Groups3Icon sx={{ color: "green" }} />,
                segment: "tview-cases",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Started",
                icon: <AutorenewIcon sx={{ color: "green" }} />,
                segment: "tview-started",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Halfway",
                icon: <LinearScaleIcon sx={{ color: "green" }} />,
                segment: "tview-halfway",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Finalizing",
                icon: <CheckCircleIcon sx={{ color: "green" }} />,
                segment: "tview-finalizing",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Completed",
                icon: <DoneIcon sx={{ color: "green" }} />,
                segment: "tview-completed",
                visible: true, // Techs CAN'T see Demo
              },
            ], // Techs CAN'T see Users
          },
        ];
      } else if (session.user.title === "Admin") {
        return [
          {
            title: "Cases",
            icon: <AddTaskIcon sx={{ color: "green" }} />,
            segment: "case",
            visible: true,
            children: [
              {
                title: "Pending Cases",
                icon: <AccessTimeIcon sx={{ color: "green" }} />,
                segment: "view-pending",
                visible: true,
              },
              {
                title: "Holded Cases",
                icon: <InfoIcon sx={{ color: "green" }} />,
                segment: "view-onhold",
                visible: true,
              },
              {
                title: "In Production",
                icon: <AutorenewIcon sx={{ color: "green" }} />,
                segment: "view-inproduction",
                visible: true,
              },
              {
                title: "Completed",
                icon: <DoneIcon sx={{ color: "green" }} />,
                segment: "view-completed",
                visible: true,
              },
            ], // Techs CAN'T see Demo
          },
          {
            title: "Bills",
            icon: <ReceiptLong sx={{ color: "green" }} />,
            segment: "bills",
            visible: true,
            children: [
              {
                title: "Invoice || Receipt",
                icon: <ReceiptLong sx={{ color: "green" }} />,
                segment: "view-invoices",
                visible: true,
              },
            ], // Techs CAN'T see Demo
          },
          {
            title: "Staff",
            segment: "staff",
            icon: <Groups3Icon sx={{ color: "green" }} />,
            visible: true,
            children: [
              {
                title: "Add Staff",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "staffregistration",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Staffs",
                segment: "staffview",
                icon: <PendingIcon sx={{ color: "green" }} />,
              },
            ], // Techs CAN'T see Users
          },
          {
            title: "Clients",
            icon: <GroupsIcon sx={{ color: "green" }} />,
            segment: "client",
            visible: true,
            children: [
              {
                title: "Add Client",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-client",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Clients",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-clients",
                visible: true, // Techs CAN'T see Demo
              },
            ], // Techs CAN'T see Demo
          },
          {
            title: "Manage",
            icon: <GroupsIcon sx={{ color: "green" }} />,
            segment: "manage",
            visible: true,
            children: [
              {
                title: "Add Product",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-product",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Product",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "view-product",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Add Prothesis",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-prothesis",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Prothesis",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-prothesis",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Add Condition",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-condition",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Conditons",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-conditions",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Add Special Instruction",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-sinstruction",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Special Instruction",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-sinstruction",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Add Special Condition",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-typecondition",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Special Conditons",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-typecondition",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Add Possible Attachment",
                icon: <GroupsIcon sx={{ color: "green" }} />,
                segment: "add-enclosed",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Possible Attachment",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-enclosed",
                visible: true, // Techs CAN'T see Demo
              },
            ], // Techs CAN'T see Demo
          },
        ];
      } else if (session.user.title === "reception") {
        return [
          {
            title: "Create Task",
            icon: <AddTaskIcon sx={{ color: "green" }} />,
            segment: "add-task",
            visible: true, // Techs CAN'T see Demo
          },
        ];
      } else if (session.user.title === "doctor") {
        return [
          {
            title: "Case & Task",
            icon: <CasesIcon sx={{ color: "green" }} />,
            segment: "cases",
            visible: true,
            children: [
              {
                title: "Create Task",
                icon: <AddTaskIcon sx={{ color: "green" }} />,
                segment: "doctor-task",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "Create Case",
                icon: <TaskIcon sx={{ color: "green" }} />,
                segment: "create-case",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Cases",
                icon: <VisibilityIcon sx={{ color: "green" }} />,
                segment: "view-cases",
                visible: true, // Techs CAN'T see Demo
              },
            ], // Techs CAN'T see Demo
          },
          {
            title: "Patients",
            icon: <MedicationLiquidIcon sx={{ color: "green" }} />,
            segment: "patients",
            visible: true,
            children: [
              {
                title: "Add Patient",
                icon: <MedicationIcon sx={{ color: "green" }} />,
                segment: "add-patient",
                visible: true, // Techs CAN'T see Demo
              },
              {
                title: "View Patients",
                icon: <VaccinesIcon sx={{ color: "green" }} />,
                segment: "view-patient",
                visible: true, // Techs CAN'T see Demo
              },
            ], // Techs CAN'T see Demo
          },
        ];
      }
    }

    return baseNavigation; // Default: show only visible items
  }, [session]); // Dependency array is now just [session]

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
