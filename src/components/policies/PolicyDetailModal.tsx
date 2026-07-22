import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Download, X } from "lucide-react";
import { type ReactNode } from "react";
import type { PolicyData } from "../../types/models";
import { api, getMemberListText } from "../../services/api";
import { getIconForCategory } from "../../services/iconUtils";

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#3B6D11", bg: "#EAF3DE" },
  due: { label: "Expiring Soon", color: "#854F0B", bg: "#FAEEDA" },
  upcoming: { label: "Upcoming", color: "#1456A0", bg: "#EBF3FC" },
  external: { label: "External", color: "#6B6963", bg: "#F1EFE8" },
  expired: { label: "Expired", color: "#A32D2D", bg: "#FCEBEB" },
};

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 600,
        color: "text.disabled",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
        borderBottom: "1px solid",
        borderColor: "border.main",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          flexShrink: 0,
          mr: 1.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: "text.primary",
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function PolicyDetailModal({
  policy,
  open,
  onClose,
}: {
  policy: PolicyData | null;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activePolicy, setActivePolicy] = useState<PolicyData | null>(null);

  useEffect(() => {
    if (policy) setActivePolicy(policy);
  }, [policy]);

  const currentPolicy = policy || activePolicy;

  if (!currentPolicy) return null;

  const st = statusMap[currentPolicy.status] ?? statusMap.active;
  const isExternal = currentPolicy.isExternal || currentPolicy.status === "external";
  const iconConfig = getIconForCategory(currentPolicy.category, currentPolicy.status);

  const handleDownload = () => {
    api.downloadCertificate(currentPolicy.id);
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: isMobile ? "90vh" : "85vh",
      }}
    >
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "center",
          pt: 1.25,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: "2px",
            bgcolor: "border.light",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.25,
          py: 1.75,
          pt: { xs: 1, sm: 1.75 },
          borderBottom: "1px solid",
          borderColor: "border.main",
        }}
      >
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Policy Details
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            width: 32,
            height: 32,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "surface.secondary",
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 2.25,
          py: 2.25,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "border.main",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "10px",
              bgcolor: iconConfig.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {iconConfig.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {currentPolicy.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.disabled",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {currentPolicy.policyNumber}
            </Typography>
          </Box>
          <Chip
            label={st.label}
            size="small"
            sx={{
              bgcolor: st.bg,
              color: st.color,
              fontWeight: 600,
              fontSize: 10,
              height: "auto",
              px: 1,
              py: 0.25,
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SectionTitle>Policy Information</SectionTitle>
          <DetailRow label="Insurer" value={currentPolicy.insurer} />
          <DetailRow label="Policy Type" value={currentPolicy.type || "—"} />
          <DetailRow
            label="Policy Number"
            value={
              <Typography
                sx={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {currentPolicy.policyNumber}
              </Typography>
            }
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SectionTitle>Coverage Details</SectionTitle>
          <DetailRow
            label={currentPolicy.coverageLabel || "Sum Insured"}
            value={currentPolicy.sumInsuredDisplay || `₹${currentPolicy.sumInsured?.toLocaleString("en-IN")}`}
          />
          <DetailRow label="Annual Premium" value={currentPolicy.premiumDisplay || `₹${currentPolicy.premiumAnnual?.toLocaleString("en-IN")}`} />
          <DetailRow label="Deductible" value={currentPolicy.deductibleDisplay || "N/A"} />
          <DetailRow
            label="Covered Members"
            value={currentPolicy.memberIds?.length ? getMemberListText(currentPolicy.memberIds) : "—"}
          />
        </Box>

        <Box>
          <SectionTitle>Key Dates</SectionTitle>
          <DetailRow label="Renewal Date" value={currentPolicy.renewDateDisplay || "—"} />
        </Box>
      </Box>

      <Box
        sx={{
          px: 2.25,
          py: 1.5,
          pb: { xs: 2.5, sm: 1.5 },
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
          borderTop: "1px solid",
          borderColor: "border.main",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={onClose}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: "none",
            minHeight: 36,
            px: 1.75,
            py: 1,
            borderColor: "border.light",
            color: "text.secondary",
          }}
        >
          Close
        </Button>

        {!isExternal && (
          <Button
            size="small"
            variant="contained"
            onClick={handleDownload}
            sx={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "none",
              minHeight: 36,
              px: 1.75,
              py: 1,
              bgcolor: "info.light",
              color: "info.main",
              boxShadow: "none",
              border: "1px solid #B5D4F4",
            }}
            startIcon={<Download size={16} />}
          >
            Download Certificate
          </Button>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 20 }}
        slotProps={{
          paper: {
            sx: { borderRadius: "16px 16px 0 0" },
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            maxWidth: "460px",
          },
        },
      }}
    >
      {content}
    </Dialog>
  );
}
