// customer_router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";
import DentalLabApp from "./pages/homep";
import ChooseClass from "./pages/chooseclass";
import DashboardPage1 from "./pages/dashboard";
import AdminPanel from "./pages/admin";

// Jina la repository yako ya GitHub. Hakikisha hili linafanana na jina halisi la repo yako.
// Kulingana na URL yako (jikutechtips.github.io/class), jina la repo ni 'class'.
const GITHUB_REPO_NAME = "class";

const router = createBrowserRouter(
  [
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
  ],
  {
    // Hapa ndipo unapo ongeza basename. Hii inaiambia React Router msingi wa URL.
    basename: `/${GITHUB_REPO_NAME}`,
  }
);

export default router;
