import { useState, useEffect, useRef } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { X, Download, Upload, FileText } from "lucide-react";
import { type ReactNode } from "react";
import type { ClaimData, DocumentData } from "../../types/models";
import { claimStatusMap as statusMap } from "../../contexts/InsuranceContext";
import { QontoConnector, QontoStepIcon } from "../shared/ClaimStepper";
import { api } from "../../services/api";

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
  claim: ClaimData | null;
};

export default function ClaimDetailModal({ open, onClose, claim }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeClaim, setActiveClaim] = useState<ClaimData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (claim) setActiveClaim(claim);
  }, [claim]);

  const currentClaim = claim || activeClaim;

  const loadDocuments = async (claimId: string) => {
    setLoadingDocs(true);
    try {
      const docs = await api.getDocuments({ relatedToId: claimId, docType: "claim-doc" });
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (currentClaim?.id && open) {
      loadDocuments(currentClaim.id);
    }
  }, [currentClaim?.id, open]);

  if (!currentClaim) return null;

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentClaim.id) return;
    setUploading(true);
    try {
      await api.uploadDocument(file, {
        memberId: currentClaim.memberId,
        relatedToId: currentClaim.id,
        docType: "claim-doc",
        name: file.name,
      });
      await loadDocuments(currentClaim.id);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const st = statusMap[currentClaim.status] || { label: currentClaim.statusDisplay || currentClaim.status, color: "#1456A0", bg: "#EBF3FC" };

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
          Claim Tracker
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
            📋
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
              {currentClaim.claimType}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.disabled",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {currentClaim.claimNumber}
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
          <SectionTitle>Claim Information</SectionTitle>
          <DetailRow label="Policy" value={currentClaim.policyName} />
          <DetailRow label="Insurer" value={currentClaim.insurer} />
          <DetailRow label="Member Name" value={currentClaim.memberName} />
          <DetailRow
            label="Claimed Amount"
            value={currentClaim.amountDisplay || `₹${currentClaim.amount.toLocaleString("en-IN")}`}
          />
          {currentClaim.hospital && (
            <DetailRow label="Hospital / Provider" value={currentClaim.hospital} />
          )}
          <DetailRow label="Date of Incident" value={currentClaim.filedDateDisplay || "—"} />
        </Box>

        {currentClaim.steps && currentClaim.steps.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <SectionTitle>Status Timeline</SectionTitle>
            <Box sx={{ mt: 1.5, width: "100%", pb: 1 }}>
              <Stepper
                alternativeLabel={!isMobile}
                orientation={isMobile ? "vertical" : "horizontal"}
                activeStep={currentClaim.step}
                connector={isMobile ? undefined : <QontoConnector />}
                sx={{ width: "100%" }}
              >
                {currentClaim.steps.map((label, idx) => (
                  <Step key={label}>
                    <StepLabel
                      slots={{ stepIcon: QontoStepIcon }}
                      slotProps={{
                        label: {
                          sx: {
                            fontSize: 11,
                            fontWeight: idx === currentClaim.step ? 600 : 500,
                            color: idx === currentClaim.step ? "text.primary" : "text.disabled",
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
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <SectionTitle>Attached Documents</SectionTitle>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleUploadDoc}
            />
            <Button
              size="small"
              variant="outlined"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              startIcon={uploading ? <CircularProgress size={12} /> : <Upload size={12} />}
              sx={{ fontSize: 11, textTransform: "none", py: 0.25, px: 1 }}
            >
              {uploading ? "Uploading..." : "Attach Document"}
            </Button>
          </Box>

          {loadingDocs ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <CircularProgress size={16} />
            </Box>
          ) : documents.length === 0 ? (
            <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
              No documents attached yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {documents.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    borderRadius: 1.5,
                    bgcolor: "surface.secondary",
                    border: "1px solid",
                    borderColor: "border.main",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                    <FileText size={16} color="#1456A0" />
                    <Typography sx={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {doc.name}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => api.downloadDocument(doc.id)}>
                    <Download size={14} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
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
