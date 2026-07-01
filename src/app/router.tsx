import { createBrowserRouter, Navigate } from "react-router-dom";

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/policies",
    element: (
      <ProtectedRoute>
        <PoliciesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/claims",
    element: (
      <ProtectedRoute>
        <ClaimsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/endorsements",
    element: (
      <ProtectedRoute>
        <EndorsementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requirements",
    element: (
      <ProtectedRoute>
        <RequirementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <UploadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets",
    element: (
      <ProtectedRoute>
        <TicketsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/members",
    element: (
      <ProtectedRoute>
        <MembersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/vehicles",
    element: (
      <ProtectedRoute>
        <VehiclesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/documents",
    element: (
      <ProtectedRoute>
        <DocumentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alerts",
    element: (
      <ProtectedRoute>
        <AlertsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

