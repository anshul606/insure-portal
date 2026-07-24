import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { Check } from "lucide-react";

/**
 * Shared styled stepper components used by ClaimDetailModal and ClaimsTable.
 * Extracted here to avoid duplication between the two files.
 */
export const QontoConnector = styled(StepConnector)(() => ({
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

export const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ ownerState }) => ({
    color: "#D0CFC9",
    display: "flex",
    height: 22,
    alignItems: "center",
    "& .QontoStepIcon-completedIcon": {
      color: "#3B6D11",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    ...(ownerState.active && {
      color: "#1456A0",
      "& .QontoStepIcon-circle": {
        width: 12,
        height: 12,
        boxShadow: "0 0 0 3px rgba(20,86,160,0.2)",
      },
    }),
  }),
);

export function QontoStepIcon(props: { active?: boolean; completed?: boolean; className?: string }) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" size={16} />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}
