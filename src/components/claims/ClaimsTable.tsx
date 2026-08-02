import { useState } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ClaimData } from "../../types/models";
import { claimStatusMap as statusMap } from "../../contexts/InsuranceContext";
import ClaimDetailModal from "./ClaimDetailModal";
import { QontoConnector, QontoStepIcon } from "../shared/ClaimStepper";

export default function ClaimsTable({ claims }: { claims: ClaimData[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  const [selectedClaimForModal, setSelectedClaimForModal] = useState<ClaimData | null>(null);

  const toggleExpand = (claimId: string) => {
    setExpandedClaimId(expandedClaimId === claimId ? null : claimId);
  };

  return (
    <UiCard sx={{ p: 0, overflow: "hidden" }}>
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "1.4fr 1.2fr 0.8fr 0.8fr 0.8fr 0.7fr 0.6fr",
          gap: 1,
          px: 2,
          py: 1.25,
          bgcolor: "surface.secondary",
          borderBottom: "1px solid",
          borderColor: "border.main",
        }}
      >
        {["Claim", "Policy", "Member", "Amount", "Filed", "Status", ""].map(
          (h) => (
            <Typography
              key={h}
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {h}
            </Typography>
          ),
        )}
      </Box>

      {claims.map((claim, i) => {
        const st = statusMap[claim.status] || { label: claim.statusDisplay || claim.status, color: "#1456A0", bg: "#EBF3FC" };
        const isExpanded = expandedClaimId === claim.id;

        return (
          <Box
            key={claim.id}
            sx={{
              borderBottom: i < claims.length - 1 ? "1px solid" : "none",
              borderColor: "border.main",
              transition: "background 0.1s",
              bgcolor: isExpanded ? "rgba(20,86,160,0.01)" : "transparent",
            }}
          >
            <Box
              onClick={() => toggleExpand(claim.id)}
              sx={{
                display: { xs: "none", md: "grid" },
                gridTemplateColumns:
                  "1.4fr 1.2fr 0.8fr 0.8fr 0.8fr 0.7fr 0.6fr",
                gap: 1,
                px: 2,
                py: 1.5,
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(20,86,160,0.02)" },
                "&:active": { bgcolor: "surface.secondary" },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {claim.claimType}
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
              <Typography
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {claim.policyName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {claim.memberName}
              </Typography>
              <Typography
                sx={{ fontSize: 12, fontWeight: 500, color: "text.primary" }}
              >
                {claim.amountDisplay || `₹${claim.amount.toLocaleString("en-IN")}`}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                {claim.filedDateDisplay || "—"}
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
                  width: "fit-content",
                }}
              />
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(claim.id);
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
                  justifySelf: "end",
                }}
              >
                {isExpanded ? "Close" : (claim.status === "approved" || claim.status === "settled" ? "View" : "Track")}
              </Button>
            </Box>

            <Box
              onClick={() => setSelectedClaimForModal(claim)}
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                gap: 0.75,
                px: 2,
                py: 1.5,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(20,86,160,0.02)" },
                "&:active": { bgcolor: "surface.secondary" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "text.primary",
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
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  fontSize: 11,
                  color: "text.disabled",
                  flexWrap: "wrap",
                }}
              >
                <span>{claim.memberName}</span>
                <span>{claim.amountDisplay || `₹${claim.amount.toLocaleString("en-IN")}`}</span>
                <span>{claim.filedDateDisplay || "—"}</span>
              </Box>
            </Box>

            {isExpanded && (
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  bgcolor: "surface.light",
                  borderTop: "1px solid",
                  borderColor: "border.main",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>INSURER</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 600 }}>{claim.insurer}</Typography>
                  </Box>
                  {claim.hospital && (
                    <Box>
                      <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>HOSPITAL / PROVIDER</Typography>
                      <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 600 }}>{claim.hospital}</Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>FILED DATE</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 600 }}>{claim.filedDateDisplay || "—"}</Typography>
                  </Box>
                </Box>

                {claim.steps && claim.steps.length > 0 && (
                  <Box sx={{ mt: 1, width: "100%", pb: 1 }}>
                    <Stepper
                      alternativeLabel={!isMobile}
                      orientation={isMobile ? "vertical" : "horizontal"}
                      activeStep={claim.step}
                      connector={isMobile ? undefined : <QontoConnector />}
                      sx={{ width: "100%" }}
                    >
                      {claim.steps.map((label, idx) => (
                        <Step key={label}>
                          <StepLabel
                            slots={{ stepIcon: QontoStepIcon }}
                            slotProps={{
                              label: {
                                sx: {
                                  fontSize: 11,
                                  fontWeight: idx === claim.step ? 600 : 500,
                                  color: idx === claim.step ? "text.primary" : "text.disabled",
                                  textAlign: isMobile ? "left" : "center",
                                },
                              },
                            }}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      })}
      <ClaimDetailModal
        open={!!selectedClaimForModal}
        onClose={() => setSelectedClaimForModal(null)}
        claim={selectedClaimForModal}
      />
    </UiCard>
  );
}
