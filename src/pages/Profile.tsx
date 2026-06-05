import Box from "@mui/material/Box";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";

export default function ProfilePage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Profile"
          content="Manage your account settings and preferences."
        ></Welcome>
      </Box>
    </AppLayout>
  );
}
