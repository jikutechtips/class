// main.tsx (customRoutes)
import * as React from "react";
import DashboardPage from "./pages";
import OrdersPage from "./pages/orders";
import AddDoctor from "./pages/add-doctor";
import AddClients from "./pages/add-client";
import SignInSide from "./pages/sign-in-side/SignInSide";
import AddArticle from "./pages/addarticle";
import AdminPanel from "./pages/admin";

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
    path: "/add-doctor",
    element: <AddDoctor />, // Use JSX element
  },
  {
    path: "/dashboard",
    element: <DashboardPage />, // Use JSX element
  },
  {
    path: "/sign-in",
    element: <SignInSide />, // Use JSX element
  },
  { path: "/admin", element: <AdminPanel /> },
];

export default customRoutes;
