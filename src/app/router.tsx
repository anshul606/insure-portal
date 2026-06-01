import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Login.tsx";
import DashboardPage from "../pages/Dashboard.tsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);
