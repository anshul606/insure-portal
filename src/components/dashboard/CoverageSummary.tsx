import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import type { CoverageRow } from "../../types/models";

type CoverageItemProps = {
  label: string;
  value: string;
  progress: number;
  color: "primary" | "success" | "warning" | "error" | "info";
};

const categoryColorMap: Record<string, "primary" | "success" | "warning" | "error" | "info"> = {
  health: "primary",
  motor: "warning",
  life: "success",
  home: "info",
  travel: "info",
};

function CoverageItem({ label, value, progress, color }: CoverageItemProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}
        >
          {label}
        </Typography>
        <Typography
          sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary" }}
        >
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={color}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
          },
        }}
      />
    </Box>
  );
}

export default function CoverageSummary({
  coverageSummary,
  annualPremiumOutgoDisplay,
}: {
  coverageSummary: CoverageRow[];
  annualPremiumOutgoDisplay: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        Coverage Summary
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, flex: 1 }}>
        {coverageSummary.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", mt: 4 }}>
            No coverage details available.
          </Typography>
        ) : (
          coverageSummary.map((item) => {
            const color = categoryColorMap[item.category.toLowerCase()] || "primary";
            const displayValue = item.utilizedDisplay && item.utilizedDisplay !== "—" && item.utilizedDisplay !== "₹0"
              ? `${item.utilizedDisplay} / ${item.sumInsuredDisplay}`
              : `${item.sumInsuredDisplay} cover`;

            return (
              <CoverageItem
                key={item.category}
                label={item.label}
                value={displayValue}
                progress={item.utilizedPercent}
                color={color}
              />
            );
          })
        )}
      </Box>

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          mt: 3,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Annual premium outgo
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}
        >
          {annualPremiumOutgoDisplay || "—"}
        </Typography>
      </Box>
    </Box>
  );
}
