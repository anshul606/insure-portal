import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Login.tsx";
import DashboardPage from "../pages/Dashboard.tsx";
import PoliciesPage from "../pages/Policies.tsx";
import ClaimsPage from "../pages/Claims.tsx";
import EndorsementsPage from "../pages/Endorsements.tsx";
import RequirementsPage from "../pages/Requirements.tsx";
import UploadPage from "../pages/Upload.tsx";
import TicketsPage from "../pages/Tickets.tsx";
import MembersPage from "../pages/Members.tsx";
import DocumentsPage from "../pages/Documents.tsx";
import VehiclesPage from "../pages/Vehicles.tsx";
import AlertsPage from "../pages/Alerts.tsx";
import ProfilePage from "../pages/Profile.tsx";
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
    path: "/claims",
    element: <ClaimsPage />,
  },
  {
    path: "/endorsements",
    element: <EndorsementsPage />,
  },
  {
    path: "/requirements",
    element: <RequirementsPage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/tickets",
    element: <TicketsPage />,
  },
  {
    path: "/members",
    element: <MembersPage />,
  },
  {
    path: "/vehicles",
    element: <VehiclesPage />,
  },
  {
    path: "/documents",
    element: <DocumentsPage />,
  },
  {
    path: "/alerts",
    element: <AlertsPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
