import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { ClipboardList } from "lucide-react";
import { type ClaimData, statusMap } from "../../contexts/ClaimContext";

export default function ClaimCard({
  claim,
  onClick,
}: {
  claim: ClaimData;
  onClick?: () => void;
}) {
  const st = statusMap[claim.status];

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: 3,
        p: 1.75,
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 0.15s",
        "@media (hover: hover)": {
          "&:hover": {
            borderColor: "primary.main",
          },
        },
        "&:active": {
          bgcolor: "surface.secondary",
        },
      }}
    >
      {/* Header with icon, title, and status */}
      <Box
        sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: 1.25 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "9px",
            bgcolor: st.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ClipboardList size={19} color={st.color} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "text.primary",
              mb: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {claim.policyName} — {claim.claimType}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.disabled",
              fontFamily: "monospace",
            }}
          >
            {claim.claimNumber}
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

      {/* Meta row */}
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
        <span>{claim.memberName}</span>
        <span>{claim.filedDate}</span>
        <span>{claim.amount}</span>
      </Box>

      {/* Footer with divider and action button */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "border.main",
          pt: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.75,
          flexWrap: "wrap",
        }}
      >
        {claim.status === "doc-requested" && (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
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
            Upload Documents
          </Button>
        )}
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
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
          {claim.status === "approved" || claim.status === "settled"
            ? "View Details"
            : "Track Claim"}
        </Button>
      </Box>
    </Box>
  );
}
