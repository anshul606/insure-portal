import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import UploadForm from "../components/upload/UploadForm";
import UploadedList from "../components/upload/UploadedList";

export default function UploadPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Upload External Policy"
          content="Have policies from other agents or insurers? Upload them so your advisor can manage renewals."
          hideMemberSelector
        />

        <Box sx={{ mt: 3, width: "100%" }}>
          <Box sx={{ maxWidth: 800, mb: 4 }}>
            <UploadForm />
          </Box>
          <UploadedList />
        </Box>
      </Box>
    </AppLayout>
  );
}
