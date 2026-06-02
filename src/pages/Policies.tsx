import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: 4,
        }}
      >
        <Welcome
          title="Policies"
          content="All active and archived policies across your family group."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
