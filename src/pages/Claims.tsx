import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function ClaimsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Claims"
          content="Track and manage all your insurance claims."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
