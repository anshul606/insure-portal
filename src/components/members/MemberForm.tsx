import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function MemberForm({ onCancel }: { onCancel: () => void }) {
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
          Add Family Member
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          Enter the personal and KYC details for the new member.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Full Name"
            placeholder="e.g. Rajesh Sharma"
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
            select
            label="Relationship"
            fullWidth
            size="small"
            required
            defaultValue="Spouse"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {["Spouse", "Son", "Daughter", "Father", "Mother", "Other"].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Date of Birth"
            type="date"
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
            select
            label="Gender"
            fullWidth
            size="small"
            required
            defaultValue="Male"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {["Male", "Female", "Other"].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Mobile Number"
            placeholder="e.g. +91 98765 43210"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
          <TextField
            label="Email Address"
            placeholder="e.g. member@email.com"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="PAN Number"
            placeholder="e.g. ABCDE1234F"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light", fontFamily: "DM Mono, monospace" },
              },
            }}
          />
          <TextField
            label="Aadhaar Number"
            placeholder="e.g. 1234 5678 9012"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light", fontFamily: "DM Mono, monospace" },
              },
            }}
          />
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
            Save Member
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
