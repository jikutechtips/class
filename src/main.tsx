import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Route, RouterProvider } from "react-router";
import router from "./customer_router";
import { SignInCard } from "./pages/sign-in-side/SignInCard";
import Content from "./pages/sign-in-side/Content";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />{" "}
  </React.StrictMode>
);
