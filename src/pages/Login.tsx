import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Eye, EyeOff, Shield } from "lucide-react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import { api } from "../services/api";
import { resetRedirectGuard } from "../services/apiClient";
import { useBranding } from "../contexts/BrandingContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { orgCode, setOrgCode, branding, getLogoUrl } = useBranding();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrg, setCurrentOrg] = useState(orgCode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentOrg(orgCode);
  }, [orgCode]);

  const handleOrgChange = (newOrg: string) => {
    setCurrentOrg(newOrg);
    setOrgCode(newOrg);
  };

  const handleQuickCredential = (org: string, user: string, pass: string) => {
    handleOrgChange(org);
    setUsername(user);
    setPassword(pass);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetOrg = currentOrg.trim() || orgCode;

    try {
      const result = await api.login(targetOrg, username, password);
      resetRedirectGuard();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("portal_org_code", targetOrg);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const logoSrc = branding?.loginLogoUrl ? getLogoUrl(branding.loginLogoUrl) : "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {logoSrc ? (
        <Box
          component="img"
          src={logoSrc}
          alt={branding?.name || "Broker Logo"}
          sx={{
            maxHeight: 64,
            maxWidth: 240,
            objectFit: "contain",
            mb: 1.5,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1456A0 0%, #4F46E5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 6px 20px rgba(20,86,160,0.25)",
            mb: 1.5,
          }}
        >
          <Shield size={32} />
        </Box>
      )}

      <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5, textAlign: "center" }}>
        {branding?.name || "InsurePortal"}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 3, textAlign: "center" }}>
        Your Insurance Portfolio Client Portal
      </Typography>

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 2.5, textAlign: "center", letterSpacing: "0.01em" }}>
          Client Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}>
            Username / Login ID
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your username"
            variant="outlined"
            size="small"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <User size={18} color="#A8A49E" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: "background.default" }
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            variant="outlined"
            size="small"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <EyeOff size={18} color="#A8A49E" /> : <Eye size={18} color="#A8A49E" />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: "background.default" }
              }
            }}
          />
          <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, color: "text.disabled" }}>Quick test:</Typography>
            <Chip
              label="rajesh (Marsh)"
              size="small"
              onClick={() => handleQuickCredential("marsh", "rajesh", "Marsh@123")}
              sx={{ fontSize: 10, height: 22, cursor: "pointer" }}
            />
            <Chip
              label="arjun (ABIBL)"
              size="small"
              onClick={() => handleQuickCredential("abibl", "arjun", "Abibl@123")}
              sx={{ fontSize: 10, height: 22, cursor: "pointer" }}
            />
          </Box>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            mt: 1,
            "&:hover": { boxShadow: "none" }
          }}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </Button>

        <Typography sx={{ fontSize: 11, color: "text.disabled", textAlign: "center", mt: 3, lineHeight: 1.6 }}>
          Secured by 256-bit SSL encryption<br />
          Powered by LeadCRM Multi-Tenant Portal
        </Typography>
      </Box>
    </Box>
  );
}
