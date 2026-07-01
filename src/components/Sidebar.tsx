import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import { useMember } from "../contexts/MemberContext";
import { useAlert } from "../contexts/InsuranceContext";
import { api } from "../services/api";
import type { Advisor } from "../types/models";
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
  badge?: number;
};

function NavItem({ icon, label, to, onClick, color, badge }: NavItemProps) {
  const innerContent = (isActive: boolean) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        px: 1.5,
        py: { xs: 0.75, md: 1 },
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: isActive ? "rgba(20,86,160,0.08)" : "transparent",
        color: color || (isActive ? "#1456A0" : "text.secondary"),
        "&:hover": {
          bgcolor: "rgba(20,86,160,0.05)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
      {badge !== undefined && badge > 0 && (
        <Box
          sx={{
            bgcolor: "error.main",
            color: "error.contrastText",
            px: 0.75,
            py: 0.125,
            borderRadius: 5,
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 16,
            height: 16,
          }}
        >
          {badge}
        </Box>
      )}
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
  const { members, selectedMemberId, setSelectedMemberId } = useMember();
  const { alerts } = useAlert();
  const unreadCount = alerts.filter((a) => !a.read).length;
  const [showMemberSelect, setShowMemberSelect] = useState(false);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);

  useEffect(() => {
    async function loadAdvisor() {
      try {
        const data = await api.getAdvisor();
        setAdvisor(data);
      } catch (err) {
        console.error("Failed to load advisor:", err);
      }
    }
    loadAdvisor();
  }, []);

  const handleMemberSelect = (id: string) => {
    setSelectedMemberId(id);
    setShowMemberSelect(false);
    if (onClose) onClose();
  };

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

        <Box sx={{ mt: 1, mb: { xs: 1.5, md: 3 } }}>
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

        <Box sx={{ mt: 1, mb: { xs: 1.5, md: 3 } }}>
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
            badge={unreadCount}
          />
          <NavItem
            icon={<User size={18} />}
            label="Profile"
            to="/profile"
            onClick={onClose}
          />
        </Box>

        {/* Dedicated Advisor Card */}
        {advisor && (
          <Box
            sx={{
              mt: { xs: 2, md: 4 },
              mx: 1,
              p: 1.5,
              borderRadius: 3,
              bgcolor: "surface.secondary",
              border: "1px solid",
              borderColor: "border.main",
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 1,
              }}
            >
              Your Dedicated Advisor
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
              {advisor.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 1 }}>
              {advisor.role}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
              <Typography sx={{ fontSize: 11, color: "primary.main", display: "flex", alignItems: "center", gap: 0.5 }}>
                📞 {advisor.phone}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "primary.main", display: "flex", alignItems: "center", gap: 0.5 }}>
                ✉️ {advisor.email}
              </Typography>
            </Box>
          </Box>
        )}
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
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <NavItem
            icon={<RefreshCcw size={18} />}
            label="Switch Member"
            to="#"
            onClick={() => setShowMemberSelect(!showMemberSelect)}
            color="#1456A0"
          />

          {showMemberSelect && (
            <Box
              sx={{
                pl: 4,
                pr: 1,
                py: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                maxHeight: 180,
                overflowY: "auto",
                borderLeft: "2px solid",
                borderColor: "primary.light",
                ml: 2,
                mb: 1.5,
              }}
            >
              <Typography
                onClick={() => handleMemberSelect("all")}
                sx={{
                  fontSize: 12,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  fontWeight: selectedMemberId === "all" ? 600 : 500,
                  color: selectedMemberId === "all" ? "#1456A0" : "text.secondary",
                  bgcolor: selectedMemberId === "all" ? "rgba(20,86,160,0.08)" : "transparent",
                  "&:hover": { bgcolor: "rgba(20,86,160,0.05)" },
                }}
              >
                All Members (Sharma Family)
              </Typography>
              {members.map((m) => (
                <Typography
                  key={m.id}
                  onClick={() => handleMemberSelect(m.id)}
                  sx={{
                    fontSize: 12,
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    fontWeight: selectedMemberId === m.id ? 600 : 500,
                    color: selectedMemberId === m.id ? "#1456A0" : "text.secondary",
                    bgcolor: selectedMemberId === m.id ? "rgba(20,86,160,0.08)" : "transparent",
                    "&:hover": { bgcolor: "rgba(20,86,160,0.05)" },
                  }}
                >
                  {m.name}
                </Typography>
              ))}
            </Box>
          )}
        </Box>

        <NavItem
          icon={<LogOut size={18} />}
          label="Logout"
          to="#"
          onClick={() => {
            if (onClose) onClose();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
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
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
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
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}
              >
                InsurePortal
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <select
                  value={selectedMemberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#1456A0",
                    backgroundColor: "rgba(20,86,160,0.06)",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    cursor: "pointer",
                    outline: "none",
                    width: "100%",
                    maxWidth: "140px",
                    fontFamily: "inherit",
                  }}
                >
                  <option value="all">Sharma Family (Group)</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {content}
        </Box>
      </Drawer>
    </>
  );
}
