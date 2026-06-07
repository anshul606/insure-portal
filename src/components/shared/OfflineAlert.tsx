import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { WifiOff } from "lucide-react";

export default function OfflineAlert() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bgcolor: "error.main",
        color: "error.contrastText",
        py: 1.25,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.25,
        zIndex: 9999,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        animation: "slideDown 0.3s ease-out forwards",
        "@keyframes slideDown": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
      }}
    >
      <WifiOff size={18} />
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
        No Internet Connection
      </Typography>
    </Box>
  );
}
