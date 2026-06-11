import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function VehicleForm({ onCancel }: { onCancel: () => void }) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: { xs: 2.5, md: 3 },
        borderRadius: { xs: 3, md: 4 },
        border: "1px solid",
        borderColor: "border.main",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary" }}>
          Add New Vehicle
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          Enter the vehicle's registration and make details to link it to your family group.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Make & Model"
            placeholder="e.g. Honda City ZX"
            fullWidth
            size="small"
            required
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
          <TextField
            label="Registration Number"
            placeholder="e.g. MH-12-AB-1234"
            fullWidth
            size="small"
            required
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light", fontFamily: "DM Mono, monospace" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            select
            label="Owner (Family Member)"
            fullWidth
            size="small"
            required
            defaultValue="Rajesh Sharma"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {["Rajesh Sharma", "Priya Sharma", "Other"].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Vehicle Type"
            fullWidth
            size="small"
            required
            defaultValue="Car"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {["Car", "Two Wheeler", "Commercial"].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            mt: 2,
            pt: 2.5,
            borderTop: "1px solid",
            borderColor: "border.main",
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              color: "text.secondary",
              borderColor: "border.main",
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={{ textTransform: "none", borderRadius: 2, px: 3 }}>
            Save Vehicle
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
