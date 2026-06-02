import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Bell } from "lucide-react";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid #E4E3DF",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",

              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",

              display: "flex",
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
            }}
          >
            InsurePortal
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton>
            <Bell size={20} />
          </IconButton>

          <Avatar
            sx={{
              width: 36,
              height: 36,
            }}
          >
            A
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
