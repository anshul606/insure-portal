import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function TicketsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Support Tickets"
          content="Create and track your support requests."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
