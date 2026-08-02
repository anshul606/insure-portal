import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { AlertTriangle, Upload } from "lucide-react";
import type { KycItem } from "../../types/models";
import { api } from "../../services/api";

const kycStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: "✓ Verified", color: "#3B6D11", bg: "#EAF3DE" },
  pending: { label: "Pending Review", color: "#854F0B", bg: "#FAEEDA" },
  "not-added": { label: "Not Added", color: "#5F5E5A", bg: "#F1EFE8" },
};

export default function KycCard({
  memberId,
  kycItems: initialKycItems = [],
  onKycUpdated,
}: {
  memberId?: string;
  kycItems?: KycItem[];
  onKycUpdated?: () => void;
}) {
  const [items, setItems] = useState<KycItem[]>(initialKycItems);
  const [loading, setLoading] = useState(false);
  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadKyc = async () => {
    if (!memberId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMemberKyc(memberId);
      setItems(data);
    } catch {
      setItems(initialKycItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKyc();
  }, [memberId]);

  const handleFileUpload = async (label: string, file: File) => {
    if (!memberId) return;
    setUploadingLabel(label);
    setError(null);
    try {
      await api.uploadMemberKycDocument(memberId, label, file);
      await loadKyc();
      if (onKycUpdated) onKycUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
    } finally {
      setUploadingLabel(null);
    }
  };

  const pendingCount = items.filter((k) => k.status !== "verified").length;

  return (
    <UiCard>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
          KYC Verification
        </Typography>
        {loading && <CircularProgress size={14} />}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 1.5, fontSize: 11, py: 0 }}>
          {error}
        </Alert>
      )}

      {items.map((item) => {
        const st = kycStatusMap[item.status] || kycStatusMap["not-added"];
        const isUploading = uploadingLabel === item.label;

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
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {item.label}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

              {item.status !== "verified" && (
                <>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={(el) => { fileInputRefs.current[item.label] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(item.label, file);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={isUploading}
                    onClick={() => fileInputRefs.current[item.label]?.click()}
                    startIcon={isUploading ? <CircularProgress size={10} /> : <Upload size={12} />}
                    sx={{
                      fontSize: 10,
                      py: 0.25,
                      px: 1,
                      minWidth: 0,
                      textTransform: "none",
                    }}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        );
      })}

      {pendingCount > 0 && (
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
              Upload documents for pending KYC items to complete verification.
            </Typography>
          </Box>
        </Box>
      )}

      {pendingCount === 0 && items.length > 0 && (
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
