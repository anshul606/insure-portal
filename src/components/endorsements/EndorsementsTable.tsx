import { useState } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Check } from "lucide-react";
import type { EndorsementData } from "../../types/models";
import { endorsementStatusMap as statusMap } from "../../contexts/InsuranceContext";
import EndorsementDetailModal from "./EndorsementDetailModal";

const EndorsementConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1456A0",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#3B6D11",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#E5E5E0",
    borderTopWidth: 3,
    borderRadius: 1,
    transition: "border-color 0.2s ease",
  },
}));

const EndorsementStepIconRoot = styled("div")<{ ownerState: { state: string } }>(
  ({ ownerState }) => ({
    color: "#D0CFC9",
    display: "flex",
    height: 22,
    alignItems: "center",
    "& .StepIcon-completedIcon": {
      color: "#3B6D11",
      zIndex: 1,
      fontSize: 18,
    },
    "& .StepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    ...(ownerState.state === "current" && {
      color: "#1456A0",
      "& .StepIcon-circle": {
        width: 12,
        height: 12,
        boxShadow: "0 0 0 3px rgba(20,86,160,0.2)",
      },
    }),
    ...(ownerState.state === "done" && {
      color: "#3B6D11",
    }),
  }),
);

function EndorsementStepIcon(props: { active?: boolean; completed?: boolean; iconState: string }) {
  const { iconState } = props;

  return (
    <EndorsementStepIconRoot ownerState={{ state: iconState }}>
      {iconState === "done" ? (
        <Check className="StepIcon-completedIcon" size={16} />
      ) : (
        <div className="StepIcon-circle" />
      )}
    </EndorsementStepIconRoot>
  );
}

export default function EndorsementsTable({
  endorsements,
}: {
  endorsements: EndorsementData[];
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedEndId, setExpandedEndId] = useState<string | null>(null);
  const [selectedEndorsementForModal, setSelectedEndorsementForModal] = useState<EndorsementData | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEndId(expandedEndId === id ? null : id);
  };

  return (
    <UiCard sx={{ p: 0, overflow: "hidden" }}>
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "1.2fr 1.4fr 0.8fr 0.8fr 0.7fr 0.6fr",
          gap: 1,
          px: 2,
          py: 1.25,
          bgcolor: "surface.secondary",
          borderBottom: "1px solid",
          borderColor: "border.main",
        }}
      >
        {["Type", "Policy", "Member", "Requested", "Status", ""].map((h) => (
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
        ))}
      </Box>

      {endorsements.map((end, i) => {
        const st = statusMap[end.status] || { label: end.statusDisplay || end.status, color: "#6B6963", bg: "#F1EFE8" };
        const isExpanded = expandedEndId === end.id;

        const activeStepIndex = end.timeline ? end.timeline.findIndex((s) => s.state === "current") : -1;
        const fallbackActiveStep = activeStepIndex !== -1 ? activeStepIndex : (end.status === "completed" ? (end.timeline?.length || 0) : 0);

        return (
          <Box
            key={end.id}
            sx={{
              borderBottom: i < endorsements.length - 1 ? "1px solid" : "none",
              borderColor: "border.main",
              transition: "background 0.1s",
              bgcolor: isExpanded ? "rgba(20,86,160,0.01)" : "transparent",
            }}
          >
            <Box
              onClick={() => toggleExpand(end.id)}
              sx={{
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: "1.2fr 1.4fr 0.8fr 0.8fr 0.7fr 0.6fr",
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
                  {end.type}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.disabled",
                    fontFamily: "monospace",
                  }}
                >
                  {end.endorsementNumber}
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
                {end.policyName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {end.memberName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                {end.requestedDateDisplay || "—"}
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
                  toggleExpand(end.id);
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
                {isExpanded ? "Close" : (end.status === "completed" || end.status === "rejected" ? "View" : "Track")}
              </Button>
            </Box>

            <Box
              onClick={() => setSelectedEndorsementForModal(end)}
              sx={{
                display: { xs: "none", md: "none" },
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
                    {end.type}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "text.disabled",
                      fontFamily: "monospace",
                    }}
                  >
                    {end.endorsementNumber}
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
                <span>{end.policyName}</span>
                <span>{end.memberName}</span>
                <span>{end.requestedDateDisplay || "—"}</span>
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
                    <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>REQUEST TYPE</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 600 }}>{end.type}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>REQUESTED DATE</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 600 }}>{end.requestedDateDisplay || "—"}</Typography>
                  </Box>
                  {end.completedDateDisplay && (
                    <Box>
                      <Typography sx={{ fontSize: 11, color: "text.disabled", fontWeight: 500 }}>COMPLETED DATE</Typography>
                      <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 600 }}>{end.completedDateDisplay}</Typography>
                    </Box>
                  )}
                </Box>

                {end.timeline && end.timeline.length > 0 && (
                  <Box sx={{ mt: 1, width: "100%", pb: 1 }}>
                    <Stepper
                      alternativeLabel={!isMobile}
                      orientation={isMobile ? "vertical" : "horizontal"}
                      activeStep={fallbackActiveStep}
                      connector={isMobile ? undefined : <EndorsementConnector />}
                      sx={{ width: "100%" }}
                    >
                      {end.timeline.map((step) => (
                        <Step key={step.label} completed={step.state === "done"}>
                          <StepLabel
                            slots={{
                              stepIcon: (props: any) => (
                                <EndorsementStepIcon {...props} iconState={step.state} />
                              ),
                            }}
                            slotProps={{
                              label: {
                                sx: {
                                  fontSize: 11,
                                  fontWeight: step.state === "current" ? 600 : 500,
                                  color: step.state === "current" || step.state === "done" ? "text.primary" : "text.disabled",
                                  textAlign: isMobile ? "left" : "center",
                                },
                              },
                            }}
                          >
                            {step.label}
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
      <EndorsementDetailModal
        open={!!selectedEndorsementForModal}
        onClose={() => setSelectedEndorsementForModal(null)}
        endorsement={selectedEndorsementForModal}
      />
    </UiCard>
  );
}
