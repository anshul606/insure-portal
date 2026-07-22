import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import { Bell, RefreshCcw, ChevronDown, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PopoverMenu from "./PopoverMenu";
import { useMember } from "../contexts/MemberContext";
import { useAlert } from "../contexts/InsuranceContext";
import { useBranding } from "../contexts/BrandingContext";

export default function Header() {
  const navigate = useNavigate();
  const [groupAnchorEl, setGroupAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const { members, selectedMemberId, setSelectedMemberId, activeMember } = useMember();
  const { alerts } = useAlert();
  const { branding, getLogoUrl } = useBranding();
  const unreadCount = alerts.filter((a) => !a.read).length;

  const storedUserRaw = typeof localStorage !== "undefined" ? localStorage.getItem("user") : null;
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const userName = storedUser?.name || "Client";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "CL";

  const handleGroupClick = (event: React.MouseEvent<HTMLElement>) => setGroupAnchorEl(event.currentTarget);
  const handleGroupClose = () => setGroupAnchorEl(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const selectGroup = (id: string) => {
    setSelectedMemberId(id);
    handleGroupClose();
  };

  const handleLogout = () => {
    handleProfileClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMemberId");
    navigate("/");
  };

  const squareIconSrc = branding?.squareIconUrl ? getLogoUrl(branding.squareIconUrl) : "";

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="inherit"
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {squareIconSrc ? (
              <Box
                component="img"
                src={squareIconSrc}
                alt="Broker Logo"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #1456A0 0%, #4F46E5 100%)",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(20,86,160,0.25)",
                }}
              >
                <Shield size={20} />
              </Box>
            )}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.03em",
                fontSize: { xs: 16, md: 18 },
                color: "text.primary",
              }}
            >
              {branding?.name || "InsurePortal"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            <Box
              onClick={handleGroupClick}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 6,
                px: 1.5,
                py: 0.75,
                cursor: "pointer",
                "&:hover": { borderColor: "text.disabled" },
              }}
            >
              <RefreshCcw size={14} color="#6B6963" />
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary" }}>
                {activeMember?.id === "all" ? "All Family Members" : activeMember?.name}
              </Typography>
              <ChevronDown size={14} color="#6B6963" />
            </Box>

            <IconButton size="small" sx={{ color: "text.secondary" }} onClick={() => navigate("/alerts")}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 9,
                    height: 16,
                    minWidth: 16,
                    padding: "0 3px",
                  }
                }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>

            <Avatar
              onClick={handleProfileClick}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(20,86,160,0.1)",
                color: "#1456A0",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {userInitials}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <PopoverMenu anchorEl={groupAnchorEl} open={Boolean(groupAnchorEl)} onClose={handleGroupClose} width={220}>
        <Typography variant="overline" sx={{ px: 1.5, py: 0.5, color: "text.disabled", fontWeight: 600, lineHeight: 1.5 }}>
          Switch Member
        </Typography>
        <MenuItem
          onClick={() => selectGroup("all")}
          sx={{
            borderRadius: 1.5,
            fontSize: 13,
            fontWeight: selectedMemberId === "all" ? 600 : 500,
            bgcolor: selectedMemberId === "all" ? "rgba(20,86,160,0.08)" : "transparent",
            color: selectedMemberId === "all" ? "#1456A0" : "text.primary",
            mb: 0.25,
            "&:hover": {
              bgcolor: selectedMemberId === "all" ? "rgba(20,86,160,0.12)" : "action.hover",
            }
          }}
        >
          All Members
        </MenuItem>
        {members.map((member) => (
          <MenuItem
            key={member.id}
            onClick={() => selectGroup(member.id)}
            sx={{
              borderRadius: 1.5,
              fontSize: 13,
              fontWeight: selectedMemberId === member.id ? 600 : 500,
              bgcolor: selectedMemberId === member.id ? "rgba(20,86,160,0.08)" : "transparent",
              color: selectedMemberId === member.id ? "#1456A0" : "text.primary",
              mb: 0.25,
              "&:hover": {
                bgcolor: selectedMemberId === member.id ? "rgba(20,86,160,0.12)" : "action.hover",
              }
            }}
          >
            {member.name}
          </MenuItem>
        ))}
      </PopoverMenu>

      <PopoverMenu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileClose} width={200}>
        <Box sx={{ px: 1.5, py: 1, mb: 0.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>{userName}</Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{storedUser?.clientId || ""}</Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { handleProfileClose(); navigate("/profile"); }} sx={{ borderRadius: 1.5, fontSize: 13, py: 1 }}>Profile settings</MenuItem>
        <MenuItem onClick={() => { handleProfileClose(); navigate("/tickets"); }} sx={{ borderRadius: 1.5, fontSize: 13, py: 1 }}>Help & Support</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ borderRadius: 1.5, fontSize: 13, py: 1, color: "error.main" }}>Logout</MenuItem>
      </PopoverMenu>
    </>
  );
}
