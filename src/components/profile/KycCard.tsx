import { useState } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { KycItem } from "../../types/models";
import { api } from "../../services/api";

const kycStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: "✓ Verified", color: "#3B6D11", bg: "#EAF3DE" },
  pending: { label: "Pending Review", color: "#854F0B", bg: "#FAEEDA" },
  "not-added": { label: "Not Added", color: "#5F5E5A", bg: "#F1EFE8" },
};

export default function KycCard({
  memberId,
  kycItems = [],
  onKycUpdated,
}: {
  memberId?: string;
  kycItems: KycItem[];
  onKycUpdated?: () => void;
}) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const pendingCount = kycItems.filter((k) => k.status !== "verified").length;

  const handleCompleteKyc = async () => {
    if (!memberId) {
      navigate("/upload");
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      await api.updateMemberKyc(memberId, { status: "pending" });
      setMsg("KYC verification request submitted successfully!");
      if (onKycUpdated) onKycUpdated();
    } catch (err: any) {
      navigate("/upload");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UiCard>
      <Typography
        sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", mb: 1.5 }}
      >
        KYC Verification
      </Typography>

      {msg && (
        <Alert severity="success" sx={{ mb: 1.5, fontSize: 11, py: 0 }}>
          {msg}
        </Alert>
      )}

      {kycItems.map((item) => {
        const st = kycStatusMap[item.status] || kycStatusMap["not-added"];
        return (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.25,
              borderBottom: "1px solid",
              borderColor: "border.main",
              "&:last-of-type": { borderBottom: "none" },
              minHeight: 44,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {item.label}
            </Typography>
            <Chip
              label={st.label}
              size="small"
              sx={{
                bgcolor: st.bg,
                color: st.color,
                fontWeight: 600,
                fontSize: 10,
                height: "auto",
                px: 0.5,
                py: 0.25,
              }}
            />
          </Box>
        );
      })}

      {pendingCount > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.25,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "warning.light",
              border: "1px solid #FAC775",
              mt: 1.5,
              mb: 1.25,
            }}
          >
            <AlertTriangle
              size={16}
              color="#854F0B"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <Box>
              <Typography
                sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}
              >
                {pendingCount} item{pendingCount > 1 ? "s" : ""} pending
              </Typography>
              <Typography
                sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}
              >
                Complete KYC for faster claim settlement.
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            size="small"
            variant="contained"
            disabled={submitting}
            onClick={handleCompleteKyc}
            startIcon={submitting ? <CircularProgress size={12} color="inherit" /> : null}
            sx={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "none",
              minHeight: 36,
              bgcolor: "info.light",
              color: "info.main",
              border: "1px solid #B5D4F4",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "info.light",
                opacity: 0.9,
                boxShadow: "none",
              },
            }}
          >
            {submitting ? "Submitting..." : "Complete KYC"}
          </Button>
        </>
      )}

      {pendingCount === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "success.light",
            border: "1px solid #C0DD97",
            mt: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#3B6D11" }}>
            ✓ All KYC documents verified
          </Typography>
        </Box>
      )}
    </UiCard>
  );
}
