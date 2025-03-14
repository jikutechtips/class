// main.tsx (customRoutes)
import * as React from "react";
import DashboardPage from "./pages";
import OrdersPage from "./pages/orders";
import AddDoctor from "./pages/add-doctor";
import ColumnTypesGrid from "./pages/page1";
import StaffRegistration from "./admin/staffregistration";
import StaffView from "./pages/staffview";
import ReceptionAddTask from "./reception/add-task";
import ViewClients from "./pages/view-clients";
import AddClients from "./pages/add-client";
import AddPatient from "./doctor/add-patient";
import ViewPatient from "./doctor/view-patient";
import AddProthesis from "./admin/add-prothesis";
import ViewProthesis from "./admin/view-prothesis";
import AddProduct from "./admin/add-product";
import ViewProduct from "./admin/view-product";
import AddContions from "./admin/add-condition";
import ViewConditions from "./admin/view-conditions";
import AddConditions from "./admin/add-condition";
import AddTpCondition from "./admin/add-typecondition";
import ViewTpCondition from "./admin/view-typecondition";
import AddSInstruction from "./admin/add-sinstruction";
import ViewSInstrution from "./admin/view-sinstruction";
import AddEnclosed from "./admin/add-enclosed";
import ViewEnclosed from "./admin/view-enclosed";
import CreateCase from "./doctor/create-case";
import ViewCases from "./doctor/view-cases";
import ViewPendings from "./admin/view-pending";
import ViewHolded from "./admin/view-onhold";
import ViewStarted from "./admin/view-inproduction";
import ViewCompleted from "./admin/view-completed";
import TechViewCases from "./technician/tview-cases";
import TechViewCasesStarted from "./technician/tview-started";
import TechViewCasesHalfway from "./technician/tview-halfway";
import TechViewCasesFinalizing from "./technician/tview-finalizing";
import TechViewCasesCompleted from "./technician/tview-completed";
import ViewBills from "./admin/view-bills";
import SignInSide from "./pages/sign-in-side/SignInSide";
import { SignInPage } from "@toolpad/core/SignInPage";
import { SignInCard } from "./pages/sign-in-side/SignInCard";

interface RouteConfig {
  path: string;
  element: React.ReactNode; // Change to React.ReactNode
  children?: RouteConfig[];
}

const customRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <DashboardPage />, // Use JSX element
  },
  {
    path: "/orders",
    element: <OrdersPage />, // Use JSX element
  },
  {
    path: "/page1",
    element: <ColumnTypesGrid />, // Use JSX element
  },
  {
    path: "/add-doctor",
    element: <AddDoctor />, // Use JSX element
  },
  {
    path: "/staff/staffregistration",
    element: <StaffRegistration />, // Use JSX element
  },
  {
    path: "/staff/staffview",
    element: <StaffView />, // Use JSX element
  },
  {
    path: "/client/view-clients",
    element: <ViewClients />, // Use JSX element
  },
  {
    path: "/client/add-client",
    element: <AddClients />, // Use JSX element
  },
  {
    path: "/add-task",
    element: <ReceptionAddTask />, // Use JSX element
  },
  {
    path: "/cases/doctor-task",
    element: <ReceptionAddTask />, // Use JSX element
  },
  {
    path: "/cases/create-case",
    element: <CreateCase />, // Use JSX element
  },
  {
    path: "/cases/view-cases",
    element: <ViewCases />, // Use JSX element
  },
  {
    path: "/patients/view-patient",
    element: <ViewPatient />, // Use JSX element
  },
  {
    path: "/patients/add-patient",
    element: <AddPatient />, // Use JSX element
  },
  {
    path: "/manage/view-product",
    element: <ViewProduct />, // Use JSX element
  },
  {
    path: "/manage/add-product",
    element: <AddProduct />, // Use JSX element
  },
  {
    path: "/manage/view-prothesis",
    element: <ViewProthesis />, // Use JSX element
  },
  {
    path: "/manage/add-prothesis",
    element: <AddProthesis />, // Use JSX element
  },
  {
    path: "/manage/view-conditions",
    element: <ViewConditions />, // Use JSX element
  },
  {
    path: "/manage/add-condition",
    element: <AddConditions />, // Use JSX element
  },
  {
    path: "/manage/add-typecondition",
    element: <AddTpCondition />, // Use JSX element
  },
  {
    path: "/manage/view-typecondition",
    element: <ViewTpCondition />, // Use JSX element
  },
  {
    path: "/manage/add-sinstruction",
    element: <AddSInstruction />, // Use JSX element
  },
  {
    path: "/manage/view-sinstruction",
    element: <ViewSInstrution />, // Use JSX element
  },
  {
    path: "/case/view-pending",
    element: <ViewPendings />, // Use JSX element
  },
  {
    path: "/case/view-onhold",
    element: <ViewHolded />, // Use JSX element
  },
  {
    path: "/case/view-inproduction",
    element: <ViewStarted />, // Use JSX element
  },
  {
    path: "/case/view-completed",
    element: <ViewCompleted />, // Use JSX element
  },
  {
    path: "/manage/add-enclosed",
    element: <AddEnclosed />, // Use JSX element
  },
  {
    path: "/manage/view-enclosed",
    element: <ViewEnclosed />, // Use JSX element
  },
  {
    path: "/tech/tview-cases",
    element: <TechViewCases />, // Use JSX element
  },
  {
    path: "/tech/tview-started",
    element: <TechViewCasesStarted />, // Use JSX element
  },
  {
    path: "/tech/tview-halfway",
    element: <TechViewCasesHalfway />, // Use JSX element
  },
  {
    path: "/tech/tview-finalizing",
    element: <TechViewCasesFinalizing />, // Use JSX element
  },
  {
    path: "/tech/tview-completed",
    element: <TechViewCasesCompleted />, // Use JSX element
  },
  {
    path: "/bills/view-bills",
    element: <ViewBills />, // Use JSX element
  },
  {
    path: "/bills/view-invoices",
    element: <ViewBills />, // Use JSX element
  },
  {
    path: "/sign-in",
    element: <SignInSide />, // Use JSX element
  },
];

export default customRoutes;
