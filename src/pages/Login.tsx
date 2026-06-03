import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Eye, EyeOff } from "lucide-react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 600);
  };

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
      <Box
        sx={{
          width: 68,
          height: 68,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 24,
          boxShadow: "0 6px 20px rgba(79,70,229,0.25)",
          mb: 1.5,
        }}
      >
        IP
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
        InsurePortal
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 4, textAlign: "center" }}>
        Your Insurance Portfolio — Preferred Choice Insurance Agency
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
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 3, textAlign: "center", letterSpacing: "0.01em" }}>
          Client Login
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 1 }}>
            Username / Mobile Number
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your username"
            variant="outlined"
            size="small"
            required
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

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 1 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            variant="outlined"
            size="small"
            required
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
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Typography sx={{ fontSize: 12, color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
            Reset Password
          </Typography>
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
            "&:hover": { boxShadow: "none" }
          }}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </Button>

        <Typography sx={{ fontSize: 11, color: "text.disabled", textAlign: "center", mt: 3, lineHeight: 1.6 }}>
          Secured by 256-bit SSL encryption<br />
          Powered by LeadCRM
        </Typography>
      </Box>
    </Box>
  );
}
