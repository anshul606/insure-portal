import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { type PolicyData } from "./PolicyCard";

const statusMap = {
  active: { label: "Active", color: "#3B6D11", bg: "#EAF3DE" },
  due: { label: "Expiring Soon", color: "#854F0B", bg: "#FAEEDA" },
  upcoming: { label: "Upcoming", color: "#1456A0", bg: "#EBF3FC" },
  external: { label: "External", color: "#6B6963", bg: "#F1EFE8" },
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

type Props = {
  open: boolean;
  onClose: () => void;
  policy: PolicyData | null;
};

export default function PolicyDetailModal({ open, onClose, policy }: Props) {
  if (!policy) return null;

  const st = statusMap[policy.status];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: "rgba(0,0,0,0.45)",
          },
        },
        paper: {
          sx: {
            borderRadius: { xs: "12px 12px 0 0", sm: "12px" },
            maxWidth: { xs: "100%", sm: "440px" },
            width: "100%",
            m: { xs: 0, sm: 2.5 },
            maxHeight: { xs: "90vh", sm: "85vh" },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },

            outline: "none !important",

            "@keyframes slideUp": {
              from: {
                transform: "translateY(100%)",
                opacity: 0,
              },
              to: {
                transform: "translateY(0)",
                opacity: 1,
              },
            },
            animation: {
              xs: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              sm: "none",
            },

            "&:focus-visible": {
              outline: "none !important",
            },
            "&:focus": {
              outline: "none !important",
            },
          },
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },

          "&:focus": {
            outline: "none !important",
          },
        },

        "& .MuiDialog-paper": {
          outline: "none !important",
          "&:focus": {
            outline: "none !important",
          },
          "&:focus-visible": {
            outline: "none !important",
          },
        },

        "& .MuiBackdrop-root": {
          outline: "none !important",
        },
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
            "&:focus": {
              outline: "none !important",
            },
            "&:focus-visible": {
              outline: "none !important",
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
              bgcolor: policy.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {policy.icon}
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
              {policy.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.disabled",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {policy.policyNumber}
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
              "& .MuiChip-label": {
                px: 0,
                py: 0,
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SectionTitle>Policy Information</SectionTitle>
          <DetailRow label="Insurer" value={policy.insurer} />
          <DetailRow label="Policy Type" value={policy.type || "—"} />
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
                {policy.policyNumber}
              </Typography>
            }
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SectionTitle>Coverage Details</SectionTitle>
          <DetailRow
            label="Sum Insured"
            value={policy.sumInsuredFull || policy.coverage}
          />
          <DetailRow label="Annual Premium" value={policy.premium || "—"} />
          <DetailRow label="Deductible" value={policy.deductible || "N/A"} />
          <DetailRow
            label="Covered Members"
            value={policy.members || policy.member}
          />
        </Box>

        <Box>
          <SectionTitle>Key Dates</SectionTitle>
          <DetailRow label="Renewal Date" value={policy.renewDate} />
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
            "&:hover": {
              borderColor: "border.light",
              bgcolor: "surface.secondary",
            },
            "&:focus": {
              outline: "none !important",
            },
            "&:focus-visible": {
              outline: "none !important",
            },
          }}
        >
          Close
        </Button>

        {policy.status !== "external" && (
          <Button
            size="small"
            variant="contained"
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
              "&:hover": {
                bgcolor: "info.light",
                opacity: 0.9,
                boxShadow: "none",
              },
              "&:focus": {
                outline: "none !important",
              },
              "&:focus-visible": {
                outline: "none !important",
              },
            }}
          >
            ⬇ Download Certificate
          </Button>
        )}
      </Box>
    </Dialog>
  );
}
