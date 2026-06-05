import { Download, X, Share, ArrowDown, Zap, Smartphone, BellRing } from "lucide-react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export default function InstallBanner() {
    const { showBanner, triggerInstall, dismiss, isIOS, canNativeInstall } = useInstallPrompt();

    if (!showBanner) return null;

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
                        background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,247,255,0.99) 100%)",
                        boxShadow: "0 -8px 60px rgba(79,70,229,0.18), 0 -2px 20px rgba(0,0,0,0.08)",
                        pb: "env(safe-area-inset-bottom, 16px)",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
                        <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: "rgba(0,0,0,0.12)" }} />
                    </Box>

                    <IconButton
                        onClick={dismiss}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            color: "rgba(0,0,0,0.35)",
                            "&:hover": { color: "rgba(0,0,0,0.6)" },
                        }}
                    >
                        <X size={18} />
                    </IconButton>

                    <Box sx={{ px: 3, pt: 1, pb: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 16,
                                    letterSpacing: "-0.03em",
                                    boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                                    flexShrink: 0,
                                }}
                            >
                                IP
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1a1a2e", lineHeight: 1.2 }}>
                                    Install InsurePortal
                                </Typography>
                                <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)", mt: 0.25 }}>
                                    Get the full app experience
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                mb: 2.5,
                                px: 0.5,
                            }}
                        >
                            {[
                                { icon: <Zap size={20} />, label: "Instant launch" },
                                { icon: <Smartphone size={20} />, label: "Home screen" },
                                { icon: <BellRing size={20} />, label: "Notifications" },
                            ].map((item) => (
                                <Box key={item.label} sx={{ textAlign: "center", flex: 1 }}>
                                    <Box sx={{ color: "#4F46E5", display: "flex", justifyContent: "center", mb: 0.5 }}>
                                        {item.icon}
                                    </Box>
                                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.55)" }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}

                        </Box>

                        {isIOS && !canNativeInstall ? (
                            <Box
                                sx={{
                                    bgcolor: "rgba(79,70,229,0.06)",
                                    borderRadius: 3,
                                    p: 2,
                                    mb: 1,
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e", mb: 1.5 }}>
                                    To install on your iPhone:
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                bgcolor: "#4F46E5",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            1
                                        </Box>
                                        <Typography sx={{ fontSize: 13, color: "#333", display: "flex", alignItems: "center", gap: 0.5 }}>
                                            Tap the <Share size={14} color="#007AFF" style={{ margin: "0 2px" }} /> Share button below
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                bgcolor: "#4F46E5",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            2
                                        </Box>
                                        <Typography sx={{ fontSize: 13, color: "#333" }}>
                                            Scroll down & tap "Add to Home Screen"
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                bgcolor: "#4F46E5",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            3
                                        </Box>
                                        <Typography sx={{ fontSize: 13, color: "#333" }}>
                                            Tap "Add" to confirm
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, opacity: 0.4 }}>
                                    <ArrowDown size={20} />
                                </Box>
                            </Box>
                        ) : (
                            <Button
                                onClick={triggerInstall}
                                fullWidth
                                startIcon={<Download size={18} />}
                                sx={{
                                    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    borderRadius: 3,
                                    py: 1.5,
                                    textTransform: "none",
                                    boxShadow: "0 4px 20px rgba(79,70,229,0.35)",
                                    "&:hover": {
                                        boxShadow: "0 6px 28px rgba(79,70,229,0.5)",
                                        background: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
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
                                fontSize: 13,
                                color: "rgba(0,0,0,0.4)",
                                mt: 1.5,
                                cursor: "pointer",
                                "&:hover": { color: "rgba(0,0,0,0.6)" },
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
