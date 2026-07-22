import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { X, Check } from "lucide-react";
import type { RequirementData } from "../../types/models";
import { requirementStatusMap as statusMap } from "../../contexts/InsuranceContext";
import { useRequirement } from "../../contexts/InsuranceContext";

function DetailRow({ label, value }: { label: string; value: string }) {
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

export default function QuoteModal({
  req,
  open,
  onClose,
}: {
  req: RequirementData | null;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { selectQuoteOptimistic } = useRequirement();
  const [activeReq, setActiveReq] = useState<RequirementData | null>(null);
  const [selectingQuoteId, setSelectingQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (req) setActiveReq(req);
  }, [req]);

  const currentReq = req || activeReq;

  if (!currentReq) return null;

  const st = statusMap[currentReq.status as keyof typeof statusMap] || { label: currentReq.statusDisplay || currentReq.status, color: "#854F0B", bg: "#FAEEDA" };

  const handleSelectQuote = async (quoteId: string) => {
    setSelectingQuoteId(quoteId);
    try {
      await selectQuoteOptimistic(currentReq.id, quoteId);
      onClose();
    } catch (err) {
      console.error("Failed to select quote:", err);
    } finally {
      setSelectingQuoteId(null);
    }
  };

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
          {currentReq.quotesAvailable ? "Available Quotes" : "Requirement Details"}
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
            justifyContent: "space-between",
            mb: 2,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "border.main",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: "info.main",
                fontFamily: "DM Mono, monospace",
                mb: 0.5,
              }}
            >
              {currentReq.id}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {currentReq.type}
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
          <SectionTitle>Requirement Details</SectionTitle>
          <DetailRow label="For Member" value={currentReq.member} />
          <DetailRow label="Coverage Required" value={currentReq.coverageDisplay || currentReq.coverage.toString()} />
          <DetailRow label="Advisor" value={currentReq.advisor} />
          <DetailRow label="Submitted On" value={currentReq.dateDisplay || currentReq.dateIso || "—"} />
        </Box>

        {/* Real Quotes list from API */}
        {currentReq.quotes && currentReq.quotes.length > 0 ? (
          <Box sx={{ mt: 2.5 }}>
            <SectionTitle>
              {`Available Quotes (${currentReq.quotes.length})`}
            </SectionTitle>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
              {currentReq.quotes.map((quote) => {
                const isSelected = quote.selected;
                return (
                  <Box
                    key={quote.id}
                    sx={{
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: isSelected ? "success.main" : "border.main",
                      boxShadow: isSelected ? "0 0 0 1px rgba(59,109,17,0.1)" : "none",
                      borderRadius: 1.5,
                      p: 1.75,
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
                      <Box sx={{ mr: 1.5 }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "text.primary",
                            mb: 0.5,
                          }}
                        >
                          {quote.insurer} — {quote.planName}
                        </Typography>
                        {quote.features && quote.features.length > 0 && (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.75 }}>
                            {quote.features.map((feat, fidx) => (
                              <Chip
                                key={fidx}
                                label={feat.text}
                                size="small"
                                sx={{
                                  fontSize: 9,
                                  height: 18,
                                  bgcolor: feat.included ? "success.light" : "surface.secondary",
                                  color: feat.included ? "#3B6D11" : "text.disabled",
                                  border: feat.included ? "none" : "1px solid",
                                  borderColor: "border.main",
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        {quote.premiumDisplay || `₹${quote.premiumAnnual.toLocaleString("en-IN")}/year`}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      disabled={isSelected || selectingQuoteId === quote.id}
                      onClick={() => handleSelectQuote(quote.id)}
                      startIcon={selectingQuoteId === quote.id ? <CircularProgress size={12} color="inherit" /> : isSelected ? <Check size={12} /> : null}
                      sx={{
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: "none",
                        minHeight: 32,
                        bgcolor: isSelected ? "success.light" : "info.light",
                        color: isSelected ? "success.main" : "info.main",
                        boxShadow: "none",
                        border: isSelected ? "1px solid #C0DD97" : "1px solid #B5D4F4",
                        "&:hover": {
                          bgcolor: isSelected ? "success.light" : "info.light",
                          opacity: 0.9,
                          boxShadow: "none",
                        },
                      }}
                    >
                      {isSelected ? "Selected Plan" : selectingQuoteId === quote.id ? "Selecting..." : "Select This Quote"}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : currentReq.status === "policy-issued" && currentReq.issuedPolicy ? (
          /* Issued Policy block */
          <Box sx={{ mt: 2.5, p: 2, bgcolor: "success.light", borderRadius: 2, border: "1px solid #C0DD97" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#3B6D11", mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
              ✓ Policy Issued Successfully
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <DetailRow label="Insurer" value={currentReq.issuedPolicy.insurer || "—"} />
              <DetailRow label="Policy Number" value={currentReq.issuedPolicy.policyNumber || "—"} />
              <DetailRow label="Sum Assured" value={currentReq.issuedPolicy.sumAssuredDisplay || (currentReq.issuedPolicy.sumAssured ? `₹${currentReq.issuedPolicy.sumAssured.toLocaleString("en-IN")}` : "—")} />
              <DetailRow label="Annual Premium" value={currentReq.issuedPolicy.premiumDisplay || (currentReq.issuedPolicy.premiumAnnual ? `₹${currentReq.issuedPolicy.premiumAnnual.toLocaleString("en-IN")}` : "—")} />
              <DetailRow label="Policy Term" value={currentReq.issuedPolicy.policyTerm || "—"} />
              <DetailRow label="Issued On" value={currentReq.issuedPolicy.issuedOnDisplay || "—"} />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "text.disabled",
                fontStyle: "italic",
              }}
            >
              No quotes available yet or policy has already been issued.
            </Typography>
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
