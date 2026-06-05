import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type AlertBannerProps = {
  type: "info" | "warn" | "success" | "danger";
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function AlertBanner({
  type,
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: AlertBannerProps) {
  const getColors = () => {
    switch (type) {
      case "info":
        return {
          bg: "#EBF3FC",
          border: "#C5DAF5",
        };
      case "warn":
        return {
          bg: "#FAEEDA",
          border: "#FAC775",
        };
      case "success":
        return {
          bg: "#EAF3DE",
          border: "#C0DD97",
        };
      case "danger":
        return {
          bg: "#FCEBEB",
          border: "#F0B0B0",
        };
    }
  };

  const colors = getColors();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.25,
        bgcolor: colors.bg,
        border: "1px solid",
        borderColor: colors.border,
        borderRadius: 1,
        p: 1.5,
      }}
    >
      <Box
        sx={{
          fontSize: 16,
          flexShrink: 0,
          mt: 0.125,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            color: "text.secondary",
            mt: 0.25,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {actionLabel && (
        <Box sx={{ flexShrink: 0, alignSelf: "center" }}>
          <Button
            size="small"
            variant="contained"
            onClick={onAction}
            sx={{
              fontSize: 11,
              fontWeight: 500,
              textTransform: "none",
              minHeight: 32,
              px: 1.375,
              py: 0.75,
              bgcolor: "info.light",
              color: "info.main",
              boxShadow: "none",
              border: "1px solid #B5D4F4",
              "&:hover": {
                bgcolor: "info.light",
                opacity: 0.9,
                boxShadow: "none",
              },
            }}
          >
            {actionLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
}
