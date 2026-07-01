import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import AlertBanner from "../components/AlertBanner";
import QuickActions from "../components/dashboard/QuickActions";
import CoverageSummary from "../components/dashboard/CoverageSummary";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useMember } from "../contexts/MemberContext";
import { api } from "../services/api";
import type { DashboardSummary, AlertData } from "../types/models";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { selectedMemberId } = useMember();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        const memberIdParam = selectedMemberId === "all" ? undefined : selectedMemberId;
        const [sumData, alertData] = await Promise.all([
          api.getDashboardSummary(memberIdParam),
          api.getAlerts(),
        ]);
        if (active) {
          setSummary(sumData);
          setAlerts(alertData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [selectedMemberId]);

  // Find top urgent unread alert (danger or warn first, then any unread)
  const unreadAlerts = alerts.filter((a) => !a.read);
  const topAlert =
    unreadAlerts.find((a) => a.severity === "danger" || a.severity === "warn") ||
    unreadAlerts[0] ||
    null;

  const handleAlertAction = (alert: AlertData) => {
    console.log("Alert action clicked:", alert);
    // Mark alert as read
    api.markAlertRead(alert.id).then(() => {
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a)));
      if (alert.actionTarget) {
        navigate(`/${alert.actionTarget.toLowerCase()}`);
      }
    });
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "danger":
        return "🚨";
      case "warn":
        return "⚠️";
      case "success":
        return "✅";
      default:
        return "ℹ️";
    }
  };

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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300, mt: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, fontSize: 14, color: "text.secondary" }}>
              Loading overview...
            </Typography>
          </Box>
        ) : (
          summary && (
            <>
              <Box sx={{ mt: 4 }}>
                <DashboardStats stats={summary.stats} />
              </Box>

              {topAlert && (
                <Box sx={{ mt: 2 }}>
                  <AlertBanner
                    type={
                      topAlert.severity === "danger"
                        ? "danger"
                        : topAlert.severity === "warn"
                        ? "warn"
                        : topAlert.severity === "success"
                        ? "success"
                        : "info"
                    }
                    icon={getAlertIcon(topAlert.severity)}
                    title={topAlert.title}
                    subtitle={topAlert.message}
                    actionLabel={topAlert.actionLabel}
                    onAction={() => handleAlertAction(topAlert)}
                  />
                </Box>
              )}

              <QuickActions />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mt: 4,
                }}
              >
                <CoverageSummary
                  coverageSummary={summary.coverageSummary}
                  annualPremiumOutgoDisplay={summary.annualPremiumOutgoDisplay}
                />
                <RecentActivity recentActivity={summary.recentActivity} />
              </Box>
            </>
          )
        )}
      </Box>
    </AppLayout>
  );
}
