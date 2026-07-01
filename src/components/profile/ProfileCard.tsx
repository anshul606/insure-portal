import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { Pencil, Lock, Check } from "lucide-react";
import type { Member } from "../../types/models";
import { api } from "../../services/api";
import { useMember } from "../../contexts/MemberContext";

const labelSx = {
    fontSize: 12,
    color: "text.disabled",
    fontWeight: 500,
    minWidth: 88,
    flexShrink: 0,
};

const valueSx = {
    fontSize: 12,
    color: "text.primary",
};

const rowSx = {
    display: "flex",
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 1,
    py: 1,
    borderBottom: "1px solid",
    borderColor: "border.main",
    "&:last-child": { borderBottom: "none" },
};

const inputSx = {
    "& .MuiInputBase-input": {
        fontSize: 12,
        py: 0.75,
        px: 1.25,
    },
};

export default function ProfileCard({ member }: { member: Member }) {
    const { refreshMembers } = useMember();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const profile = member.profile || {};
    
    const [editData, setEditData] = useState({
        mobile: profile.mobile || "",
        email: profile.email || "",
        address: profile.address || "",
    });

    useEffect(() => {
        setIsEditing(false);
        setError(null);
        setEditData({
            mobile: profile.mobile || "",
            email: profile.email || "",
            address: profile.address || "",
        });
    }, [member, profile]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await api.updateMember(member.id, editData);
            await refreshMembers();
            setIsEditing(false);
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData({
            mobile: profile.mobile || "",
            email: profile.email || "",
            address: profile.address || "",
        });
        setIsEditing(false);
        setError(null);
    };

    return (
        <UiCard>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.75,
                    pb: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "border.main",
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "info.light",
                        border: "1.5px solid #C5DAF5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "primary.main",
                        flexShrink: 0,
                    }}
                >
                    {member.initials || "?"}
                </Box>
                <Box>
                    <Typography
                        sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}
                    >
                        {member.name}
                    </Typography>
                    <Typography
                        sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}
                    >
                        {member.relationship} · {member.clientId} · Since {member.since}
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, fontSize: 11, py: 0 }}>
                    {error}
                </Alert>
            )}

            {!isEditing && (
                <Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Mobile</Typography>
                        <Typography sx={valueSx}>{profile.mobile || "—"}</Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Email</Typography>
                        <Typography sx={valueSx}>{profile.email || "—"}</Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>DOB</Typography>
                        <Typography sx={valueSx}>{profile.dobDisplay || "—"}</Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>PAN</Typography>
                        <Typography sx={{ ...valueSx, fontFamily: "monospace" }}>
                            {profile.pan || "—"}
                        </Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Aadhaar</Typography>
                        <Typography sx={{ ...valueSx, fontFamily: "monospace" }}>
                            {profile.aadhaar || "—"}
                        </Typography>
                    </Box>
                    <Box sx={{ ...rowSx, alignItems: "flex-start" }}>
                        <Typography sx={{ ...labelSx, mt: 0.25 }}>Address</Typography>
                        <Typography sx={valueSx}>{profile.address || "—"}</Typography>
                    </Box>
                </Box>
            )}

            {isEditing && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "text.secondary",
                                mb: 0.5,
                            }}
                        >
                            Mobile
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="tel"
                            disabled={saving}
                            value={editData.mobile}
                            onChange={(e) =>
                                setEditData({ ...editData, mobile: e.target.value })
                            }
                            sx={inputSx}
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "text.secondary",
                                mb: 0.5,
                            }}
                        >
                            Email
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="email"
                            disabled={saving}
                            value={editData.email}
                            onChange={(e) =>
                                setEditData({ ...editData, email: e.target.value })
                            }
                            sx={inputSx}
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "text.secondary",
                                mb: 0.5,
                            }}
                        >
                            Address
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            disabled={saving}
                            value={editData.address}
                            onChange={(e) =>
                                setEditData({ ...editData, address: e.target.value })
                            }
                            sx={inputSx}
                        />
                    </Box>
                </Box>
            )}

            <Box sx={{ mt: 1.75, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                {!isEditing ? (
                    <>
                        <Button
                            size="small"
                            startIcon={<Pencil size={12} />}
                            onClick={() => setIsEditing(true)}
                            sx={{
                                fontSize: 11,
                                fontWeight: 500,
                                px: 1.25,
                                py: 0.625,
                                borderRadius: 1.5,
                                minHeight: 32,
                                color: "text.secondary",
                                border: "1px solid",
                                borderColor: "border.light",
                                textTransform: "none",
                            }}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            size="small"
                            startIcon={<Lock size={12} />}
                            sx={{
                                fontSize: 11,
                                fontWeight: 500,
                                px: 1.25,
                                py: 0.625,
                                borderRadius: 1.5,
                                minHeight: 32,
                                color: "text.secondary",
                                border: "1px solid",
                                borderColor: "border.light",
                                textTransform: "none",
                            }}
                        >
                            Change Password
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            size="small"
                            startIcon={saving ? <CircularProgress size={12} color="inherit" /> : <Check size={12} />}
                            onClick={handleSave}
                            disabled={saving}
                            sx={{
                                fontSize: 11,
                                fontWeight: 500,
                                px: 1.25,
                                py: 0.625,
                                borderRadius: 1.5,
                                minHeight: 32,
                                bgcolor: "info.light",
                                color: "info.main",
                                border: "1px solid #B5D4F4",
                                textTransform: "none",
                                "&:hover": { bgcolor: "info.light", opacity: 0.9 },
                            }}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            size="small"
                            onClick={handleCancel}
                            disabled={saving}
                            sx={{
                                fontSize: 11,
                                fontWeight: 500,
                                px: 1.25,
                                py: 0.625,
                                borderRadius: 1.5,
                                minHeight: 32,
                                color: "text.secondary",
                                border: "1px solid",
                                borderColor: "border.light",
                                textTransform: "none",
                            }}
                        >
                            Cancel
                        </Button>
                    </>
                )}
            </Box>
        </UiCard>
    );
}
