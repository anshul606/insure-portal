import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { ClaimData } from "../../types/models";
import { statusMap } from "../../contexts/ClaimContext";

export default function ClaimsTable({ claims }: { claims: ClaimData[] }) {
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
        const st = statusMap[claim.status];
        return (
          <Box
            key={claim.id}
            sx={{
              borderBottom: i < claims.length - 1 ? "1px solid" : "none",
              borderColor: "border.main",
              cursor: "pointer",
              transition: "background 0.1s",
              "&:hover": { bgcolor: "rgba(20,86,160,0.02)" },
              "&:active": { bgcolor: "surface.secondary" },
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "grid" },
                gridTemplateColumns:
                  "1.4fr 1.2fr 0.8fr 0.8fr 0.8fr 0.7fr 0.6fr",
                gap: 1,
                px: 2,
                py: 1.5,
                alignItems: "center",
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
                {claim.amount}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                {claim.filedDate}
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
                onClick={(e) => e.stopPropagation()}
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
                {claim.status === "approved" || claim.status === "settled"
                  ? "View"
                  : "Track"}
              </Button>
            </Box>

            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                gap: 0.75,
                px: 2,
                py: 1.5,
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
                <span>{claim.amount}</span>
                <span>{claim.filedDate}</span>
              </Box>
            </Box>
          </Box>
        );
      })}
    </UiCard>
  );
}
