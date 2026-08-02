import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, styled } from "@mui/material/styles";
import { X, Check } from "lucide-react";
import { type ReactNode } from "react";
import type { EndorsementData } from "../../types/models";
import { endorsementStatusMap as statusMap } from "../../contexts/InsuranceContext";

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
  endorsement: EndorsementData | null;
};

export default function EndorsementDetailModal({ open, onClose, endorsement }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeEndorsement, setActiveEndorsement] = useState<EndorsementData | null>(null);

  useEffect(() => {
    if (endorsement) setActiveEndorsement(endorsement);
  }, [endorsement]);

  const currentEndorsement = endorsement || activeEndorsement;

  if (!currentEndorsement) return null;

  const st = statusMap[currentEndorsement.status] || { label: currentEndorsement.statusDisplay || currentEndorsement.status, color: "#1456A0", bg: "#EBF3FC" };

  const fallbackActiveStep = currentEndorsement.timeline?.findIndex((t) => t.state === "current") ?? 0;

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", maxHeight: isMobile ? "90vh" : "85vh" }}>
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
          Endorsement Tracker
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            width: 32,
            height: 32,
            color: "text.secondary",
            "&:hover": { bgcolor: "surface.secondary" },
            "&:focus": { outline: "none !important" },
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
              bgcolor: "surface.secondary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            ✍️
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
              {currentEndorsement.type}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.disabled",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {currentEndorsement.policyId}
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
          <SectionTitle>Request details</SectionTitle>
          <DetailRow label="Policy" value={currentEndorsement.policyName} />
          <DetailRow label="Insurer" value={currentEndorsement.insurer} />
          <DetailRow label="Member Name" value={currentEndorsement.memberName} />
          <DetailRow label="Requested Date" value={currentEndorsement.requestedDateDisplay || "—"} />
          {currentEndorsement.completedDateDisplay && (
            <DetailRow label="Completed Date" value={currentEndorsement.completedDateDisplay} />
          )}
        </Box>

        {currentEndorsement.timeline && currentEndorsement.timeline.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <SectionTitle>Status Timeline</SectionTitle>
            <Box sx={{ mt: 1.5, width: "100%", pb: 1 }}>
              <Stepper
                alternativeLabel={!isMobile}
                orientation={isMobile ? "vertical" : "horizontal"}
                activeStep={fallbackActiveStep}
                connector={isMobile ? undefined : <EndorsementConnector />}
                sx={{ width: "100%" }}
              >
                {currentEndorsement.timeline.map((step) => (
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
          </Box>
        )}
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
          fullWidth={isMobile}
          onClick={onClose}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: "none",
            minHeight: 36,
            px: 2.5,
            py: 1,
            borderColor: "border.light",
            color: "text.secondary",
            "&:hover": {
              borderColor: "border.light",
              bgcolor: "surface.secondary",
            },
          }}
        >
          Close
        </Button>
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
