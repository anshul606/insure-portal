import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
};

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,

        px: 1.5,
        py: 1,

        borderRadius: 2,

        cursor: "pointer",

        bgcolor: active ? "rgba(20,86,160,0.08)" : "transparent",

        color: active ? "#1456A0" : "inherit",

        "&:hover": {
          bgcolor: "rgba(20,86,160,0.05)",
        },
      }}
    >
      {icon}

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 280,
        minHeight: "calc(100vh - 64px)",
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
          active
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />

        <NavItem icon={<Shield size={18} />} label="Policies" />

        <NavItem icon={<FileText size={18} />} label="Claims" />

        <NavItem icon={<Pencil size={18} />} label="Endorsements" />
      </Box>

      <Typography variant="overline" color="text.secondary">
        Self Service
      </Typography>

      <Box sx={{ mt: 1, mb: 3 }}>
        <NavItem icon={<FileText size={18} />} label="Requirements" />

        <NavItem icon={<Upload size={18} />} label="Upload Policy" />

        <NavItem icon={<Ticket size={18} />} label="Tickets" />
      </Box>

      <Typography variant="overline" color="text.secondary">
        My Account
      </Typography>

      <Box sx={{ mt: 1 }}>
        <NavItem icon={<Users size={18} />} label="Members" />

        <NavItem icon={<FolderOpen size={18} />} label="Documents" />

        <NavItem icon={<Bell size={18} />} label="Alerts" />

        <NavItem icon={<User size={18} />} label="Profile" />
      </Box>
    </Box>
  );
}
