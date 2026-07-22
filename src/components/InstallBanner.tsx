import { Download, X, Share, ArrowDown, Zap, Smartphone, BellRing } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useBranding } from "../contexts/BrandingContext";

export default function InstallBanner() {
  const { showBanner, triggerInstall, dismiss, isIOS, canNativeInstall } = useInstallPrompt();
  const { branding, orgCode, getLogoUrl } = useBranding();

  if (!showBanner) return null;

  const logoSrc = branding?.squareIconUrl
    ? getLogoUrl(branding.squareIconUrl)
    : branding?.loginLogoUrl
    ? getLogoUrl(branding.loginLogoUrl)
    : "";

  const appName = branding?.name || "InsurePortal";
  const initials = orgCode ? orgCode.substring(0, 2).toUpperCase() : "IP";

  return (
    <>
      <Backdrop
        open
        onClick={dismiss}
        sx={{
          zIndex: 1999,
          bgcolor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      />

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          animation: "pwaSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          "@keyframes pwaSlideUp": {
            from: { transform: "translateY(100%)" },
            to: { transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            mx: "auto",
            maxWidth: 460,
            borderRadius: "20px 20px 0 0",
            overflow: "hidden",
            background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,246,243,0.99) 100%)",
            boxShadow: "0 -8px 60px rgba(0,0,0,0.15), 0 -2px 20px rgba(0,0,0,0.06)",
            pb: "env(safe-area-inset-bottom, 16px)",
            border: "1px solid",
            borderColor: "border.main",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
            <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: "border.light" }} />
          </Box>

          <IconButton
            onClick={dismiss}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "text.disabled",
              "&:hover": { color: "text.primary" },
            }}
          >
            <X size={18} />
          </IconButton>

          <Box sx={{ px: 3, pt: 1, pb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              {logoSrc ? (
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "border.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0.75,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={logoSrc}
                    alt={appName}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #1456A0 0%, #378ADD 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: "0 4px 16px rgba(20,86,160,0.25)",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </Box>
              )}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: "text.primary", lineHeight: 1.2, mb: 0.25 }}>
                  Install {appName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Get the official mobile app experience
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2.5,
                p: 1.5,
                bgcolor: "surface.secondary",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "border.main",
              }}
            >
              {[
                { icon: <Zap size={18} />, label: "Instant Access" },
                { icon: <Smartphone size={18} />, label: "Home Screen" },
                { icon: <BellRing size={18} />, label: "Alerts" },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: "center", flex: 1 }}>
                  <Box sx={{ color: "primary.main", display: "flex", justifyContent: "center", mb: 0.5 }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {isIOS && !canNativeInstall ? (
              <Box
                sx={{
                  bgcolor: "info.light",
                  borderRadius: 3,
                  p: 2,
                  mb: 1,
                  border: "1px solid",
                  borderColor: "#B5D4F4",
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: 13, color: "text.primary", mb: 1.5 }}>
                  To install on your iPhone:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      1
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "text.primary", display: "flex", alignItems: "center", gap: 0.5 }}>
                      Tap the <Share size={14} color="#1456A0" style={{ margin: "0 2px" }} /> Share button below
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      2
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "text.primary" }}>
                      Scroll down & tap "Add to Home Screen"
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      3
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "text.primary" }}>
                      Tap "Add" to confirm
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5, color: "primary.main" }}>
                  <ArrowDown size={18} />
                </Box>
              </Box>
            ) : (
              <Button
                onClick={triggerInstall}
                fullWidth
                variant="contained"
                startIcon={<Download size={18} />}
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 2,
                  py: 1.25,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: "none",
                  },
                }}
              >
                Install App
              </Button>
            )}

            <Typography
              onClick={dismiss}
              sx={{
                textAlign: "center",
                fontSize: 12,
                color: "text.disabled",
                mt: 1.5,
                cursor: "pointer",
                "&:hover": { color: "text.secondary" },
              }}
            >
              Not now
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
