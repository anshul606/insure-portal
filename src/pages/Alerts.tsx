import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function AlertsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Alerts"
          content="Stay updated with important notifications and reminders."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
