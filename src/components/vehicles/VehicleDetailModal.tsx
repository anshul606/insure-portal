import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { X, Shield } from "lucide-react";
import { type ReactNode } from "react";
import type { VehicleData } from "../../types/models";
import { useInsurance } from "../../contexts/InsuranceContext";
import PolicyDetailModal from "../policies/PolicyDetailModal";

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

export default function VehicleDetailModal({
  vehicle,
  open,
  onClose,
}: {
  vehicle: VehicleData | null;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getPolicyById } = useInsurance();
  const [activeVehicle, setActiveVehicle] = useState<VehicleData | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  useEffect(() => {
    if (vehicle) setActiveVehicle(vehicle);
  }, [vehicle]);

  const currentVehicle = vehicle || activeVehicle;

  if (!currentVehicle) return null;

  const policy = currentVehicle.policyId ? getPolicyById(currentVehicle.policyId) : null;
  const [make = "—", ...modelParts] = (currentVehicle.makeModel || "").split(" ");
  const model = modelParts.length > 0 ? modelParts.join(" ") : "—";
  const iconEmoji = currentVehicle.vehicleType === "two-wheeler" ? "🏍️" : "🚗";
  const isInsured = currentVehicle.status === "active" || currentVehicle.status === "insured";

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: isMobile ? "90vh" : "85vh",
      }}
    >
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
          Vehicle Details
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
            {iconEmoji}
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
              {currentVehicle.makeModel}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.disabled",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {currentVehicle.registrationNumber}
            </Typography>
          </Box>
          <Chip
            label={isInsured ? "Insured" : "External"}
            size="small"
            sx={{
              bgcolor: isInsured ? "#EAF3DE" : "#F1EFE8",
              color: isInsured ? "#3B6D11" : "#6B6963",
              fontWeight: 600,
              fontSize: 10,
              height: "auto",
              px: 1,
              py: 0.25,
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SectionTitle>Vehicle Information</SectionTitle>
          <DetailRow label="Make" value={make} />
          <DetailRow label="Model" value={model} />
          <DetailRow
            label="Registration Number"
            value={
              <Typography
                sx={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {currentVehicle.registrationNumber}
              </Typography>
            }
          />
          <DetailRow
            label="Vehicle Type"
            value={currentVehicle.vehicleType === "two-wheeler" ? "Two Wheeler" : "Four Wheeler / Car"}
          />
          <DetailRow label="Owner Name" value={currentVehicle.ownerName} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <SectionTitle>Insurance Details</SectionTitle>
          {policy ? (
            <>
              <DetailRow label="Insurer" value={policy.insurer} />
              <DetailRow label="Policy Type" value={policy.type || "Motor Insurance"} />
              <DetailRow
                label="Policy Number"
                value={
                  <Typography
                    sx={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {policy.policyNumber}
                  </Typography>
                }
              />
              <DetailRow
                label="Cover Amount (IDV)"
                value={currentVehicle.idvDisplay || policy.sumInsuredDisplay || `₹${(currentVehicle.idv || policy.sumInsured)?.toLocaleString("en-IN")}`}
              />
              <DetailRow
                label="Annual Premium"
                value={policy.premiumDisplay || `₹${policy.premiumAnnual?.toLocaleString("en-IN")}`}
              />
              <DetailRow label="Renewal Date" value={currentVehicle.renewDateDisplay || policy.renewDateDisplay || "—"} />
            </>
          ) : (
            <>
              <DetailRow label="Insurer" value={currentVehicle.insurer || "—"} />
              <DetailRow
                label="Cover Amount (IDV)"
                value={currentVehicle.idvDisplay || (currentVehicle.idv ? `₹${currentVehicle.idv.toLocaleString("en-IN")}` : "—")}
              />
              <DetailRow label="Renewal Date" value={currentVehicle.renewDateDisplay || currentVehicle.renewDateIso || "—"} />
            </>
          )}
        </Box>

        {policy && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: "surface.secondary",
              border: "1px solid",
              borderColor: "border.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Shield size={16} color="#1456A0" />
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.primary" }}>
                Linked Active Policy
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => setPolicyModalOpen(true)}
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: "primary.main",
                textTransform: "none",
                p: 0,
                minWidth: 0,
              }}
            >
              View Policy →
            </Button>
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

      {policy && (
        <PolicyDetailModal
          policy={policy}
          open={policyModalOpen}
          onClose={() => setPolicyModalOpen(false)}
        />
      )}
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
