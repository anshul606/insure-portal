import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function EndorsementsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Endorsements"
          content="View and request policy endorsements."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
