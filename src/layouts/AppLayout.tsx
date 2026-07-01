import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { useInsurance } from "../contexts/InsuranceContext";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { error, refreshAll } = useInsurance();

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: { xs: "76px", md: 0 },
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
          {error && (
            <Box
              sx={{
                bgcolor: "#FCEBEB",
                borderBottom: "1px solid",
                borderColor: "#F5C2C2",
                color: "#A32D2D",
                px: 3,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                ⚠️ {error}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={refreshAll}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 11,
                  borderRadius: 1.5,
                  py: 0.5,
                  px: 1.5,
                }}
              >
                Retry
              </Button>
            </Box>
          )}
          {children}
        </Box>
      </Box>

      <BottomNav onOpenDrawer={handleDrawerToggle} />
    </Box>
  );
}
