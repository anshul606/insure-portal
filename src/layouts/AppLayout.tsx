import Box from "@mui/material/Box";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: { xs: "60px", md: 0 },
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          pt: "64px",
        }}
      >
        <Sidebar
          mobileOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>

      <BottomNav onOpenDrawer={handleDrawerToggle} />
    </Box>
  );
}
