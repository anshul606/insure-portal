import Box from "@mui/material/Box";

import Header from "../components/header";
import Sidebar from "../components/Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Header />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
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
