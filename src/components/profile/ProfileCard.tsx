import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Pencil, Lock, Check } from "lucide-react";
import { type MemberProfile } from "../../contexts/MemberContext";

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

export default function ProfileCard({
    profile,
    memberName,
}: {
    profile: MemberProfile;
    memberName: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        mobile: profile.mobile,
        email: profile.email,
        address: profile.address,
    });

    useEffect(() => {
        setIsEditing(false);
        setEditData({
            mobile: profile.mobile,
            email: profile.email,
            address: profile.address,
        });
    }, [profile]);

    const handleSave = () => {
        console.log("Saving profile:", editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            mobile: profile.mobile,
            email: profile.email,
            address: profile.address,
        });
        setIsEditing(false);
    };

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "border.main",
                borderRadius: 3,
                p: 2,
            }}
        >
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
                    {profile.initials}
                </Box>
                <Box>
                    <Typography
                        sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}
                    >
                        {memberName}
                    </Typography>
                    <Typography
                        sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}
                    >
                        {profile.relationship} · {profile.clientId} · Since{" "}
                        {profile.since}
                    </Typography>
                </Box>
            </Box>

            {!isEditing && (
                <Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Mobile</Typography>
                        <Typography sx={valueSx}>{profile.mobile}</Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Email</Typography>
                        <Typography sx={valueSx}>{profile.email}</Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>DOB</Typography>
                        <Typography sx={valueSx}>{profile.dob}</Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>PAN</Typography>
                        <Typography sx={{ ...valueSx, fontFamily: "monospace" }}>
                            {profile.pan}
                        </Typography>
                    </Box>
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Aadhaar</Typography>
                        <Typography sx={{ ...valueSx, fontFamily: "monospace" }}>
                            {profile.aadhaar}
                        </Typography>
                    </Box>
                    <Box sx={{ ...rowSx, alignItems: "flex-start" }}>
                        <Typography sx={{ ...labelSx, mt: 0.25 }}>Address</Typography>
                        <Typography sx={valueSx}>{profile.address}</Typography>
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
                            value={editData.address}
                            onChange={(e) =>
                                setEditData({ ...editData, address: e.target.value })
                            }
                            sx={inputSx}
                        />
                    </Box>
                </Box>
            )}

            <Box sx={{ mt: 1.75, display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                            startIcon={<Check size={12} />}
                            onClick={handleSave}
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
                            Save Changes
                        </Button>
                        <Button
                            size="small"
                            onClick={handleCancel}
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
        </Box>
    );
}
