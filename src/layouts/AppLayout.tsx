import Box from "@mui/material/Box";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          pt: "64px",
        }}
      >
        <Sidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
