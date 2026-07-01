import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import UiCard from "../components/shared/UiCard";
import { useAlert } from "../contexts/InsuranceContext";

type SeverityConfig = {
  icon: React.ReactNode;
  color: string;
  bg: string;
  label: string;
};

const SEVERITY_MAP: Record<string, SeverityConfig> = {
  danger: {
    icon: <AlertCircle size={16} />,
    color: "#D32F2F",
    bg: "#FCEBEB",
    label: "Urgent"
  },
  warn: {
    icon: <AlertTriangle size={16} />,
    color: "#E65100",
    bg: "#FFF3E0",
    label: "Warning"
  },
  success: {
    icon: <CheckCircle2 size={16} />,
    color: "#2E7D32",
    bg: "#E8F5E9",
    label: "Success"
  },
  info: {
    icon: <Info size={16} />,
    color: "#0288D1",
    bg: "#E1F5FE",
    label: "Info"
  }
};

export default function AlertsPage() {
  const navigate = useNavigate();
  const {
    alerts,
    loading,
    refreshAlerts,
    markAlertReadOptimistic,
    markAllAlertsReadOptimistic
  } = useAlert();

  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  const handleMarkRead = async (id: string) => {
    await markAlertReadOptimistic(id);
  };

  const handleMarkAllRead = async () => {
    await markAllAlertsReadOptimistic();
  };

  const handleAction = async (alert: any) => {
    // Mark as read first
    if (!alert.read) {
      await handleMarkRead(alert.id);
    }
    // Navigate if action target exists
    if (alert.actionTarget) {
      navigate(alert.actionTarget);
    }
  };

  const unreadAlerts = alerts.filter(a => !a.read);
  const readAlerts = alerts.filter(a => a.read);

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Welcome
          title="Notifications & Alerts"
          content="Stay updated with important status changes, reminders, and policy actions."
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, mt: 2 }}>
          <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>
            You have {unreadCountText(unreadAlerts.length)}
          </Typography>
          {unreadAlerts.length > 0 && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleMarkAllRead}
              startIcon={<CheckCheck size={16} />}
              sx={{
                fontSize: 12,
                textTransform: "none",
                borderRadius: 2,
                borderColor: "border.main",
                color: "text.primary",
                "&:hover": {
                  borderColor: "text.secondary",
                  bgcolor: "surface.secondary"
                }
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        {loading && alerts.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : alerts.length === 0 ? (
          <UiCard sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, textAlign: "center" }}>
            <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "surface.secondary", display: "flex", alignItems: "center", justifyContent: "center", color: "text.disabled", mb: 2 }}>
              <Bell size={24} />
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>No alerts found</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>You are all caught up! No notifications at this time.</Typography>
          </UiCard>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Unread Alerts Section */}
            {unreadAlerts.length > 0 && (
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5 }}>
                  New ({unreadAlerts.length})
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {unreadAlerts.map(alert => renderAlertItem(alert, handleMarkRead, handleAction))}
                </Box>
              </Box>
            )}

            {/* Read Alerts Section */}
            {readAlerts.length > 0 && (
              <Box sx={{ mt: unreadAlerts.length > 0 ? 2 : 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5 }}>
                  Earlier
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, opacity: 0.8 }}>
                  {readAlerts.map(alert => renderAlertItem(alert, handleMarkRead, handleAction))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </AppLayout>
  );
}

function unreadCountText(count: number): string {
  if (count === 0) return "no unread notifications";
  if (count === 1) return "1 unread notification";
  return `${count} unread notifications`;
}

function renderAlertItem(
  alert: any,
  onMarkRead: (id: string) => void,
  onAction: (alert: any) => void
) {
  const sev = SEVERITY_MAP[alert.severity] || SEVERITY_MAP.info;

  return (
    <UiCard
      key={alert.id}
      sx={{
        borderLeft: "4px solid",
        borderLeftColor: alert.read ? "border.main" : sev.color,
        p: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          borderColor: alert.read ? "text.disabled" : sev.color
        },
        bgcolor: alert.read ? "surface.main" : "rgba(20, 86, 160, 0.02)"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        {/* Severity Icon Container */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: sev.bg,
            color: sev.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {sev.icon}
        </Box>

        {/* Text Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: alert.read ? 500 : 600, color: "text.primary" }}>
              {alert.title}
            </Typography>
            {!alert.read && (
              <Chip
                label="New"
                size="small"
                sx={{
                  height: 16,
                  fontSize: 9,
                  fontWeight: 700,
                  bgcolor: "error.main",
                  color: "error.contrastText",
                  px: 0.5
                }}
              />
            )}
            <Chip
              label={sev.label}
              size="small"
              sx={{
                height: 16,
                fontSize: 9,
                fontWeight: 600,
                bgcolor: sev.bg,
                color: sev.color,
                border: "1px solid",
                borderColor: "transparent",
                px: 0.5
              }}
            />
          </Box>

          <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.4, mb: 1 }}>
            {alert.message}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>
              {alert.timeDisplay}
            </Typography>
            {!alert.read && (
              <Button
                size="small"
                onClick={() => onMarkRead(alert.id)}
                sx={{
                  p: 0,
                  minWidth: 0,
                  fontSize: 11,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "primary.main",
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                }}
              >
                Mark as read
              </Button>
            )}
          </Box>
        </Box>

        {/* Action Button */}
        {alert.actionLabel && (
          <Button
            variant="contained"
            size="small"
            onClick={() => onAction(alert)}
            endIcon={<ArrowRight size={14} />}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 500,
              py: 0.75,
              px: 1.5,
              boxShadow: "none",
              bgcolor: alert.read ? "surface.secondary" : "primary.main",
              color: alert.read ? "text.primary" : "primary.contrastText",
              border: alert.read ? "1px solid" : "none",
              borderColor: "border.main",
              "&:hover": {
                bgcolor: alert.read ? "border.main" : "primary.dark",
                boxShadow: "none"
              }
            }}
          >
            {alert.actionLabel}
          </Button>
        )}
      </Box>
    </UiCard>
  );
}
