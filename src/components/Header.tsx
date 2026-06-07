import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Bell, RefreshCcw, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PopoverMenu from "./PopoverMenu";
import { useMember } from "../contexts/MemberContext";

export default function Header() {
  const navigate = useNavigate();
  const [groupAnchorEl, setGroupAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const { members, selectedMemberId, setSelectedMemberId, activeMember } = useMember();

  const handleGroupClick = (event: React.MouseEvent<HTMLElement>) => setGroupAnchorEl(event.currentTarget);
  const handleGroupClose = () => setGroupAnchorEl(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const selectGroup = (id: string) => {
    setSelectedMemberId(id);
    handleGroupClose();
  };

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
            <Box
              sx={{
                display: "flex",
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 6px 18px rgba(79,70,229,0.25)",
              }}
            >
              IP
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.03em",
                fontSize: { xs: 18, md: 20 },
              }}
            >
              InsurePortal
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
                {activeMember?.id === "all" ? "Sharma Family" : activeMember?.name}
              </Typography>
              <ChevronDown size={14} color="#6B6963" />
            </Box>

            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <Bell size={20} />
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
              RS
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <PopoverMenu anchorEl={groupAnchorEl} open={Boolean(groupAnchorEl)} onClose={handleGroupClose} width={220}>
        <Typography variant="overline" sx={{ px: 1.5, py: 0.5, color: "text.disabled", fontWeight: 600, lineHeight: 1.5 }}>
          Switch Member
        </Typography>
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
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>Rajesh Sharma</Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>rajesh@example.com</Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { handleProfileClose(); navigate("/profile"); }} sx={{ borderRadius: 1.5, fontSize: 13, py: 1 }}>Profile settings</MenuItem>
        <MenuItem onClick={() => { handleProfileClose(); navigate("/tickets"); }} sx={{ borderRadius: 1.5, fontSize: 13, py: 1 }}>Help & Support</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { handleProfileClose(); navigate("/"); }} sx={{ borderRadius: 1.5, fontSize: 13, py: 1, color: "error.main" }}>Logout</MenuItem>
      </PopoverMenu>
    </>
  );
}
