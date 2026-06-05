import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Shield, FileText, Bell, Menu } from "lucide-react";

type BottomNavProps = {
  onOpenDrawer: () => void;
};

export default function BottomNav({ onOpenDrawer }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
    { icon: Shield, label: "Policies", path: "/policies" },
    { icon: FileText, label: "Claims", path: "/claims" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
  ];

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        bgcolor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        zIndex: (theme) => theme.zIndex.drawer + 2,
        pb: "env(safe-area-inset-bottom)",
        alignItems: "center",
        justifyContent: "space-around",
        px: 1,
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;

        return (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: isActive ? "rgba(20,86,160,0.12)" : "transparent",
                color: isActive ? "#1456A0" : "text.secondary",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1456A0" : "text.secondary",
                transition: "color 0.2s ease",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}

      <Box
        onClick={onOpenDrawer}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            color: "text.secondary",
            "&:active": {
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <Menu size={20} strokeWidth={2} />
        </Box>
        <Typography
          sx={{ fontSize: 10, fontWeight: 500, color: "text.secondary" }}
        >
          More
        </Typography>
      </Box>
    </Box>
  );
}
