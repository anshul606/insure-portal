import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
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
  RefreshCcw,
  LogOut,
  Car,
} from "lucide-react";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  color?: string;
};

function NavItem({ icon, label, to, onClick, color }: NavItemProps) {
  const innerContent = (isActive: boolean) => (
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
        color: color || (isActive ? "#1456A0" : "text.secondary"),
        "&:hover": {
          bgcolor: "rgba(20,86,160,0.05)",
        },
      }}
    >
      {icon}

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: isActive ? 600 : 500,
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  if (!to || to === "#") {
    return (
      <Box onClick={onClick}>
        {innerContent(false)}
      </Box>
    );
  }

  return (
    <NavLink to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      {({ isActive }) => innerContent(isActive)}
    </NavLink>
  );
}


type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const content = (
    <Box
      sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <Typography
          variant="overline"
          color="text.disabled"
          sx={{ ml: 1, fontWeight: 600 }}
        >
          Portfolio
        </Typography>

        <Box sx={{ mt: 1, mb: 3 }}>
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            to="/dashboard"
            onClick={onClose}
          />
          <NavItem
            icon={<Shield size={18} />}
            label="Policies"
            to="/policies"
            onClick={onClose}
          />
          <NavItem
            icon={<FileText size={18} />}
            label="Claims"
            to="/claims"
            onClick={onClose}
          />
          <NavItem
            icon={<Pencil size={18} />}
            label="Endorsements"
            to="/endorsements"
            onClick={onClose}
          />
        </Box>

        <Typography
          variant="overline"
          color="text.disabled"
          sx={{ ml: 1, fontWeight: 600 }}
        >
          Self Service
        </Typography>

        <Box sx={{ mt: 1, mb: 3 }}>
          <NavItem
            icon={<FileText size={18} />}
            label="Requirements"
            to="/requirements"
            onClick={onClose}
          />
          <NavItem
            icon={<Upload size={18} />}
            label="Upload Policy"
            to="/upload"
            onClick={onClose}
          />
          <NavItem
            icon={<Ticket size={18} />}
            label="Tickets"
            to="/tickets"
            onClick={onClose}
          />
        </Box>

        <Typography
          variant="overline"
          color="text.disabled"
          sx={{ ml: 1, fontWeight: 600 }}
        >
          My Account
        </Typography>

        <Box sx={{ mt: 1 }}>
          <NavItem
            icon={<Users size={18} />}
            label="Members"
            to="/members"
            onClick={onClose}
          />
          <NavItem
            icon={<Car size={18} />}
            label="Vehicles"
            to="/vehicles"
            onClick={onClose}
          />
          <NavItem
            icon={<FolderOpen size={18} />}
            label="Documents"
            to="/documents"
            onClick={onClose}
          />
          <NavItem
            icon={<Bell size={18} />}
            label="Alerts"
            to="/alerts"
            onClick={onClose}
          />
          <NavItem
            icon={<User size={18} />}
            label="Profile"
            to="/profile"
            onClick={onClose}
          />
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 2,
          pb: 1,
          mt: 1,
        }}
      >
        <NavItem
          icon={<RefreshCcw size={18} />}
          label="Switch Member"
          to="#"
          onClick={onClose}
          color="#1456A0"
        />
        <NavItem
          icon={<LogOut size={18} />}
          label="Logout"
          to="#"
          onClick={onClose}
          color="#A32D2D"
        />
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: 260,
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: 64,
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          display: { xs: "none", md: "block" },
        }}
      >
        {content}
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            bgcolor: "background.paper",
            pt: 2,
            height: "calc(100% - 60px)",
            top: 0,
            bottom: "auto",
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              IP
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}
              >
                InsurePortal
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                Rajesh Sharma
              </Typography>
            </Box>
          </Box>
        </Box>
        {content}
      </Drawer>
    </>
  );
}
