import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, getMemberDisplayText } from "../../services/api";
import { getIconForCategory, getCoverageText } from "../../services/iconUtils";
import type { PolicyData } from "../../types/models";

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#3B6D11", bg: "#EAF3DE" },
  due: { label: "Expiring Soon", color: "#854F0B", bg: "#FAEEDA" },
  upcoming: { label: "Upcoming", color: "#1456A0", bg: "#EBF3FC" },
  external: { label: "External", color: "#6B6963", bg: "#F1EFE8" },
  expired: { label: "Expired", color: "#A32D2D", bg: "#FCEBEB" },
};

export default function PolicyCard({
  policy,
  onClick,
}: {
  policy: PolicyData;
  onClick?: () => void;
}) {
  const navigate = useNavigate();
  const st = statusMap[policy.status] ?? statusMap.active;
  const isExternal = policy.isExternal || policy.status === "external";
  const iconConfig = getIconForCategory(policy.category, policy.status);
  const coverageText = getCoverageText(policy.category, policy.sumInsured);

  const handleRenew = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (policy.status === "due") {
        await api.renewPolicy(policy.id);
      } else {
        await api.quotePolicy(policy.id);
      }
    } catch (err) {
      console.error(err);
    }
    navigate("/requirements");
  };

  const handleDownloadCertificate = (e: React.MouseEvent) => {
    e.stopPropagation();
    api.downloadCertificate(policy.id);
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: isExternal ? "surface.secondary" : "background.paper",
        border: "1px solid",
        borderColor: iconConfig.borderColor || "border.main",
        borderStyle: isExternal ? "dashed" : "solid",
        borderRadius: 3,
        p: 1.75,
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 0.15s",
        "@media (hover: hover)": {
          "&:hover": { borderColor: "primary.main" },
        },
        "&:active": { bgcolor: "surface.secondary" },
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: 1.25 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "9px",
            bgcolor: iconConfig.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
            flexShrink: 0,
          }}
        >
          {iconConfig.icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: isExternal ? "text.secondary" : "text.primary",
              mb: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {policy.name}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.disabled",
              fontFamily: "monospace",
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
            px: 0.5,
            py: 0.25,
            flexShrink: 0,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          fontSize: 11,
          color: "text.disabled",
          flexWrap: "wrap",
          mb: 1.25,
        }}
      >
        <span>{policy.insurer}</span>
        <span>{coverageText}</span>
        {policy.memberIds?.length > 0 && (
          <span>{getMemberDisplayText(policy.memberIds)}</span>
        )}
      </Box>

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "border.main",
          pt: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
          {policy.renewLabel || "Renews:"}{" "}
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              color: iconConfig.renewDateColor || "text.primary",
            }}
          >
            {policy.renewDateDisplay || "—"}
          </Typography>
        </Typography>
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {policy.status === "due" && (
            <Button
              size="small"
              variant="contained"
              onClick={handleRenew}
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                minHeight: 0,
                textTransform: "none",
              }}
            >
              Renew Now
            </Button>
          )}
          {isExternal && (
            <Button
              size="small"
              variant="contained"
              onClick={handleRenew}
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                minHeight: 0,
                textTransform: "none",
              }}
            >
              Get Renewal Quote
            </Button>
          )}
          {!isExternal && (
            <>
              <Button
                size="small"
                startIcon={<Download size={12} />}
                onClick={handleDownloadCertificate}
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  minHeight: 0,
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "border.main",
                  textTransform: "none",
                }}
              >
                Certificate
              </Button>
              <Button
                size="small"
                onClick={onClick}
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  minHeight: 0,
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "border.main",
                  textTransform: "none",
                }}
              >
                Details
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
