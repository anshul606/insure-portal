import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AppLayout from "../layouts/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Typography variant="h4">Dashboard</Typography>

        <Typography color="text.secondary">Welcome back.</Typography>
      </Box>
    </AppLayout>
  );
}
