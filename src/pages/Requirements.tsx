import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function RequirementsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Requirements"
          content="Submit new insurance requirements and get quotes."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
