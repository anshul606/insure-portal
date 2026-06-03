import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "24px",
                    bgcolor: "rgba(163, 45, 45, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    color: "#A32D2D",
                }}
            >
                <ShieldAlert size={40} strokeWidth={1.5} />
            </Box>

            <Typography sx={{ fontSize: 64, fontWeight: 800, color: "text.primary", lineHeight: 1, mb: 1, letterSpacing: "-0.04em" }}>
                404
            </Typography>

            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "text.primary", mb: 1.5 }}>
                Page not found
            </Typography>

            <Typography sx={{ fontSize: 14, color: "text.secondary", maxWidth: 320, mb: 4, lineHeight: 1.6 }}>
                Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                startIcon={<ArrowLeft size={18} />}
                sx={{
                    py: 1.25,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: 14,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" }
                }}
            >
                Back to Dashboard
            </Button>
        </Box>
    );
}
