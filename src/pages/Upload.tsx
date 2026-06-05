import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function UploadPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Upload Policy"
          content="Upload policies from other insurers to your portfolio."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
