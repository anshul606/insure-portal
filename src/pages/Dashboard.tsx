import Box from "@mui/material/Box";
import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import AlertBanner from "../components/AlertBanner";
import QuickActions from "../components/dashboard/QuickActions";
import CoverageSummary from "../components/dashboard/CoverageSummary";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
        }}
      >
        <Welcome
          title="Dashboard"
          content="Welcome back. Here's your family's insurance overview."
        />

        <Box sx={{ mt: 4 }}>
          <DashboardStats />
        </Box>

        <Box sx={{ mt: 2 }}>
          <AlertBanner
            type="warn"
            icon="⚠️"
            title="Car insurance renews in 12 days"
            subtitle="MTR-2024-0887654 · Bajaj Allianz · Expires 11 May 2025"
            actionLabel="Renew"
            onAction={() => {
              console.log("Renew clicked");
            }}
          />
        </Box>

        <QuickActions />

        {/* Lower Dashboard Grid (Coverage & Activity) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, // stacked on xs, side-by-side on md
            gap: 3,
            mt: 4,
          }}
        >
          <CoverageSummary />
          <RecentActivity />
        </Box>
      </Box>
    </AppLayout>
  );
}
