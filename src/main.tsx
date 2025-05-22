// main.tsx (customRoutes)
import * as React from "react";
import DashboardPage from "./pages";
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
