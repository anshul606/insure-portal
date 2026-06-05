import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function DocumentsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Documents"
          content="Access and manage all your insurance documents."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
