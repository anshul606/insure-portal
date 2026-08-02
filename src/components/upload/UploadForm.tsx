import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import { Info, Paperclip, X as XIcon, FileText } from "lucide-react";
import UiCard from "../shared/UiCard";
import { useMember } from "../../contexts/MemberContext";
import { usePolicy } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

const POLICY_TYPES = [
  "Health Insurance — Individual",
  "Health Insurance — Family Floater",
  "Motor Insurance — Car",
  "Motor Insurance — Two Wheeler",
  "Life Insurance — Term",
  "Home Insurance",
  "Travel Insurance",
];

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const getCategoryFromType = (type: string): string => {
  const lower = type.toLowerCase();
  if (lower.includes("health")) return "health";
  if (lower.includes("motor")) return "motor";
  if (lower.includes("life")) return "life";
  if (lower.includes("home")) return "home";
  if (lower.includes("travel")) return "travel";
  return "health";
};

const getCoverageLabelFromType = (type: string): string => {
  const category = getCategoryFromType(type);
  if (category === "motor") return "IDV";
  if (category === "life") return "Sum Assured";
  return "Sum Insured";
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadForm() {
  const { members } = useMember();
  const { refreshPolicies } = usePolicy();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [memberId, setMemberId] = useState(
    members.filter((m) => m.id !== "all")[0]?.id || ""
  );
  const [insurer, setInsurer] = useState("");
  const [policyType, setPolicyType] = useState(POLICY_TYPES[0]);
  const [policyNumber, setPolicyNumber] = useState("");
  const [sumInsured, setSumInsured] = useState("");
  const [premiumAnnual, setPremiumAnnual] = useState("");
  const [startDateIso, setStartDateIso] = useState("");
  const [expiryDateIso, setExpiryDateIso] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "policy" | "document" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFileError(null);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setFileError(`File too large — max 10 MB (selected: ${formatBytes(file.size)})`);
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
      setFileError("Only PDF, JPG, and PNG files are accepted.");
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  const resetForm = () => {
    setInsurer("");
    setPolicyNumber("");
    setSumInsured("");
    setPremiumAnnual("");
    setStartDateIso("");
    setExpiryDateIso("");
    setNotes("");
    setSelectedFile(null);
    setFileError(null);
    setUploadProgress("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !insurer || !policyType || !policyNumber || !expiryDateIso) {
      setError("Please fill in member, insurer, policy type, policy number, and expiry date.");
      return;
    }

    const parsedSumInsured = parseFloat(sumInsured.replace(/,/g, ""));
    const parsedPremium = parseFloat(premiumAnnual.replace(/,/g, ""));

    setSaving(true);
    setError(null);
    setSuccess(null);
    setUploadProgress("policy");

    let createdPolicyId: string | undefined;

    try {
      const newPolicy = {
        name: policyType,
        policyNumber: policyNumber.trim(),
        insurer: insurer.trim(),
        category: getCategoryFromType(policyType),
        isExternal: true,
        type: policyType,
        coverageLabel: getCoverageLabelFromType(policyType),
        sumInsured: isNaN(parsedSumInsured) ? 0 : parsedSumInsured,
        premiumAnnual: isNaN(parsedPremium) ? 0 : parsedPremium,
        memberIds: [memberId],
        status: "external",
        renewDateIso: expiryDateIso,
        ...(startDateIso ? { startDateIso } : {}),
        renewLabel: "Expires:",
        ...(notes ? { notes } : {}),
      };

      const created = await api.createPolicy(newPolicy);
      createdPolicyId = created.id;
      await refreshPolicies();

      if (selectedFile) {
        setUploadProgress("document");
        await api.uploadDocument(selectedFile, {
          memberId,
          relatedToId: createdPolicyId,
          docType: "policy-doc",
          name: `${policyType} — ${policyNumber.trim()}`,
        });
      }

      setUploadProgress("done");
      setSuccess(
        selectedFile
          ? "Policy and document uploaded successfully and added to your portfolio under review!"
          : "Policy details saved! Your advisor will be in touch before the renewal date."
      );
      resetForm();
    } catch (err: any) {
      console.error("Failed to upload policy:", err);
      if (uploadProgress === "document" && createdPolicyId) {
        setError(
          "Policy details were saved, but the document upload failed. " +
          "You can re-upload the document from the Documents section."
        );
      } else {
        setError(err.message || "Failed to save policy. Please try again.");
      }
      setUploadProgress("idle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UiCard sx={{ mb: 3 }} component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", gap: 1.5, p: 2, mb: 2, bgcolor: "#EBF3FC", borderRadius: 2, color: "#1456A0" }}>
        <Info size={20} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
            How this works
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Your advisor will review the uploaded policy and reach out before the renewal date with competitive quotes.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, fontSize: 12, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2.5, fontSize: 12, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          select
          label="Policy Holder"
          size="small"
          required
          disabled={saving}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members
            .filter((m) => m.id !== "all")
            .map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
        </TextField>

        <TextField
          label="Insurance Company"
          size="small"
          required
          disabled={saving}
          placeholder="e.g. Star Health, ICICI Lombard..."
          value={insurer}
          onChange={(e) => setInsurer(e.target.value)}
        />

        <TextField
          select
          label="Policy Type"
          size="small"
          required
          disabled={saving}
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
        >
          {POLICY_TYPES.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Policy Number"
          size="small"
          required
          disabled={saving}
          placeholder="As on policy document"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />

        <TextField
          label="Sum Insured (₹)"
          size="small"
          disabled={saving}
          placeholder="0"
          value={sumInsured}
          onChange={(e) => setSumInsured(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Annual Premium (₹)"
          size="small"
          disabled={saving}
          placeholder="0"
          value={premiumAnnual}
          onChange={(e) => setPremiumAnnual(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Policy Start Date (optional)"
          size="small"
          type="date"
          disabled={saving}
          value={startDateIso}
          onChange={(e) => setStartDateIso(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Expiry / Renewal Date"
          size="small"
          type="date"
          required
          disabled={saving}
          value={expiryDateIso}
          onChange={(e) => setExpiryDateIso(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Notes (optional)"
          size="small"
          multiline
          rows={2}
          disabled={saving}
          placeholder="Any specific notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {selectedFile ? (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "border.main",
              borderRadius: 2,
              p: 1.75,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "surface.secondary",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                bgcolor: "#EBF3FC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={18} color="#1456A0" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}
              >
                {selectedFile.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                {formatBytes(selectedFile.size)}
              </Typography>
            </Box>
            <IconButton
              size="small"
              disabled={saving}
              onClick={clearFile}
              aria-label="Remove file"
              sx={{ color: "text.secondary", flexShrink: 0 }}
            >
              <XIcon size={16} />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              border: "1.5px dashed",
              borderColor: isDragOver ? "primary.main" : fileError ? "error.main" : "border.main",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: saving ? "not-allowed" : "pointer",
              bgcolor: isDragOver ? "rgba(20,86,160,0.04)" : "surface.secondary",
              transition: "all 0.15s",
              "&:hover": saving ? {} : { borderColor: "primary.main", bgcolor: "rgba(20,86,160,0.04)" },
              opacity: saving ? 0.6 : 1,
            }}
            onClick={() => !saving && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); if (!saving) setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={saving ? undefined : handleDrop}
            role="button"
            aria-label="Upload policy document"
          >
            <Paperclip
              size={24}
              style={{ marginBottom: 8, color: isDragOver ? "#1456A0" : "var(--mui-palette-text-secondary)" }}
            />
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", mb: 0.5 }}>
              Upload Policy Document
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
              PDF, JPG, PNG · Max 10 MB · Optional but recommended
            </Typography>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          style={{ display: "none" }}
          onChange={handleInputChange}
          id="pol-file-input"
        />

        {fileError && (
          <Typography sx={{ fontSize: 12, color: "error.main", mt: -1 }}>
            {fileError}
          </Typography>
        )}

        {saving && (
          <Box>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.5 }}>
              {uploadProgress === "policy" && "Saving policy details…"}
              {uploadProgress === "document" && "Uploading document…"}
              {uploadProgress === "done" && "Done!"}
            </Typography>
            <LinearProgress
              variant="indeterminate"
              sx={{ borderRadius: 4, height: 4 }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ borderRadius: 2, minWidth: 180 }}
          >
            {saving
              ? uploadProgress === "document"
                ? "Uploading document…"
                : "Saving…"
              : selectedFile
              ? "Save & Upload Policy"
              : "Save Policy Details"}
          </Button>
        </Box>
      </Box>
    </UiCard>
  );
}
