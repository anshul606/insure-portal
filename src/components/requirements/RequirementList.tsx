import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import UiCard from "../shared/UiCard";
import QuoteModal from "./QuoteModal";
import {
  useRequirement,
  requirementStatusMap as statusMap,
} from "../../contexts/InsuranceContext";
import type { RequirementData } from "../../types/models";

export default function RequirementList() {
  const { requirements, loading } = useRequirement();
  const [selectedReq, setSelectedReq] = useState<RequirementData | null>(null);

  if (loading) {
    return (
      <Typography sx={{ p: 2, fontSize: 13, color: "text.secondary" }}>
        Loading requirements...
      </Typography>
    );
  }

  if (requirements.length === 0) {
    return (
      <Typography sx={{ p: 2, fontSize: 13, color: "text.secondary" }}>
        No requirements found.
      </Typography>
    );
  }

  return (
    <>
      <UiCard sx={{ p: 0, overflow: "hidden" }}>
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "1.2fr 1.4fr 1.2fr 0.8fr 1fr 1fr 0.8fr 0.8fr",
            gap: 1,
            px: 2,
            py: 1.25,
            bgcolor: "surface.secondary",
            borderBottom: "1px solid",
            borderColor: "border.main",
          }}
        >
          {[
            "Req. No.",
            "Category",
            "For",
            "Coverage",
            "Status",
            "Advisor",
            "Date",
            "",
          ].map((h) => (
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

        {requirements.map((req, i) => {
          const st = statusMap[req.status as keyof typeof statusMap];

          return (
            <Box
              key={req.id}
              sx={{
                borderBottom:
                  i < requirements.length - 1 ? "1px solid" : "none",
                borderColor: "border.main",
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "grid" },
                  gridTemplateColumns:
                    "1.2fr 1.4fr 1.2fr 0.8fr 1fr 1fr 0.8fr 0.8fr",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  alignItems: "center",
                  "&:hover": { bgcolor: "rgba(20,86,160,0.02)" },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.disabled",
                    fontFamily: "monospace",
                  }}
                >
                  {req.id}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, color: "text.primary", fontWeight: 500 }}
                >
                  {req.type}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {req.member}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, color: "text.primary", fontWeight: 500 }}
                >
                  {req.coverageDisplay || req.coverage}
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
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {req.advisor}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                  {req.dateDisplay || req.dateIso || "—"}
                </Typography>
                <Button
                  size="small"
                  variant={req.quotesAvailable ? "contained" : "outlined"}
                  onClick={() => setSelectedReq(req)}
                  sx={{
                    fontSize: 11,
                    fontWeight: 500,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    minHeight: 0,
                    textTransform: "none",
                    justifySelf: "end",
                    borderColor: !req.quotesAvailable
                      ? "border.main"
                      : undefined,
                    color: !req.quotesAvailable ? "text.secondary" : undefined,
                  }}
                >
                  {req.quotesAvailable ? "View Quotes" : "View"}
                </Button>
              </Box>

              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "text.disabled",
                        mb: 0.5,
                        fontFamily: "monospace",
                      }}
                    >
                      {req.id}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {req.type} — {req.coverageDisplay || req.coverage}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                    >
                      {req.member} • Advisor: {req.advisor} • {req.dateDisplay || req.dateIso || "—"}
                    </Typography>
                  </Box>
                  <Box>
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
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "border.main",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {req.quotesAvailable
                      ? `${req.quotesAvailable} quotes available`
                      : `Completed ${(req.dateDisplay || req.dateIso || "").split(" ")[1] || ""} ${(req.dateDisplay || req.dateIso || "").split(" ")[2] || ""}`}
                  </Typography>
                  <Button
                    variant={req.quotesAvailable ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setSelectedReq(req)}
                    sx={{
                      borderRadius: 2,
                      borderColor: !req.quotesAvailable
                        ? "border.main"
                        : undefined,
                      color: !req.quotesAvailable
                        ? "text.secondary"
                        : undefined,
                    }}
                  >
                    {req.quotesAvailable ? "View Quotes" : "View"}
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}
      </UiCard>

      <QuoteModal
        req={selectedReq}
        open={!!selectedReq}
        onClose={() => setSelectedReq(null)}
      />
    </>
  );
}
