import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import "../index.css";

import {
  LayoutDashboard,
  Shield,
  FileText,
  Pencil,
  Upload,
  Ticket,
  Users,
  FolderOpen,
  Bell,
  User,
} from "lucide-react";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to: string;
};

function NavItem({ icon, label, to }: NavItemProps) {
  return (
    <NavLink to={to} className="nav-link">
      {({ isActive }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            cursor: "pointer",
            bgcolor: isActive ? "rgba(20,86,160,0.08)" : "transparent",
            color: isActive ? "#1456A0" : "inherit",
            "&:hover": {
              bgcolor: "rgba(20,86,160,0.05)",
            },
          }}
        >
          {icon}

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 280,
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
        bgcolor: "background.paper",
        borderRight: "1px solid #E4E3DF",
        p: 2,

        display: {
          xs: "none",
          md: "block",
        },
      }}
    >
      <Typography variant="overline" color="text.secondary">
        Portfolio
      </Typography>

      <Box sx={{ mt: 1, mb: 3 }}>
        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          to="/dashboard"
        />

        <NavItem icon={<Shield size={18} />} label="Policies" to="/policies" />

        <NavItem icon={<FileText size={18} />} label="Claims" to="/claims" />

        <NavItem
          icon={<Pencil size={18} />}
          label="Endorsements"
          to="/endorsements"
        />
      </Box>

      <Typography variant="overline" color="text.secondary">
        Self Service
      </Typography>

      <Box sx={{ mt: 1, mb: 3 }}>
        <NavItem
          icon={<FileText size={18} />}
          label="Requirements"
          to="/requirements"
        />

        <NavItem
          icon={<Upload size={18} />}
          label="Upload Policy"
          to="/upload"
        />

        <NavItem icon={<Ticket size={18} />} label="Tickets" to="/tickets" />
      </Box>

      <Typography variant="overline" color="text.secondary">
        My Account
      </Typography>

      <Box sx={{ mt: 1 }}>
        <NavItem icon={<Users size={18} />} label="Members" to="/members" />

        <NavItem
          icon={<FolderOpen size={18} />}
          label="Documents"
          to="/documents"
        />

        <NavItem icon={<Bell size={18} />} label="Alerts" to="/alerts" />

        <NavItem icon={<User size={18} />} label="Profile" to="/profile" />
      </Box>
    </Box>
  );
}
