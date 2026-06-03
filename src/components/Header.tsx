import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Bell, RefreshCcw, ChevronDown } from "lucide-react";

export default function Header() {
  return (
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
              Sharma Family
            </Typography>
            <ChevronDown size={14} color="#6B6963" />
          </Box>

          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Bell size={20} />
          </IconButton>

          <Avatar
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
  );
}
