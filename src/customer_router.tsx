// customer_router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";
import DentalLabApp from "./pages/homep";
import ChooseClass from "./pages/chooseclass";
import DashboardPage1 from "./pages/dashboard";
import AdminPanel from "./pages/admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />, // Use JSX element
          },

          {
            path: "/chooseclass",
            element: <ChooseClass />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage1 />,
          },
          {
            path: "/admin",
            element: <AdminPanel />,
          },
        ],
      },
      {
        path: "/sign-in",
        element: <DentalLabApp />,
      },
    ],
  },
]);

export default router;
