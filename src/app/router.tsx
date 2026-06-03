import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Login.tsx";
import DashboardPage from "../pages/Dashboard.tsx";
import PoliciesPage from "../pages/Policies.tsx";
import NotFoundPage from "../pages/NotFound.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <DashboardPage />,
  },

  {
    path: "/policies",
    element: <PoliciesPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);
