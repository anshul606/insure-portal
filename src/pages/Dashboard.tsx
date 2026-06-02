import Box from "@mui/material/Box";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import AppLayout from "../layouts/AppLayout";
import DashboardStats from "../components/dashboard/DashboardStats";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: 4,
        }}
      >
        <DashboardHeader />
        <Box sx={{ mt: 4 }}>
          <DashboardStats />
        </Box>
      </Box>
    </AppLayout>
  );
}
