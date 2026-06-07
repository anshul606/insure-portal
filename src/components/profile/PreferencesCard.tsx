import { useState } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

type Prefs = {
    smsRenewal: boolean;
    emailRenewal: boolean;
    whatsappClaims: boolean;
    pushNotifications: boolean;
};

const prefItems: { label: string; key: keyof Prefs }[] = [
    { label: "Renewal reminders via SMS", key: "smsRenewal" },
    { label: "Renewal reminders via Email", key: "emailRenewal" },
    { label: "Claim updates via WhatsApp", key: "whatsappClaims" },
    { label: "Push notifications", key: "pushNotifications" },
];

export default function PreferencesCard() {
    const [prefs, setPrefs] = useState<Prefs>({
        smsRenewal: true,
        emailRenewal: true,
        whatsappClaims: true,
        pushNotifications: false,
    });

    return (
        <UiCard>
            <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", mb: 1 }}
            >
                Communication Preferences
            </Typography>

            {prefItems.map((item) => (
                <Box
                    key={item.key}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1.25,
                        borderBottom: "1px solid",
                        borderColor: "border.main",
                        "&:last-of-type": { borderBottom: "none" },
                        minHeight: 44,
                    }}
                >
                    <Typography
                        sx={{ fontSize: 12, color: "text.primary", flex: 1, pr: 1.5 }}
                    >
                        {item.label}
                    </Typography>
                    <Switch
                        size="small"
                        checked={prefs[item.key]}
                        onChange={(e) =>
                            setPrefs({ ...prefs, [item.key]: e.target.checked })
                        }
                        sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#fff",
                                "& + .MuiSwitch-track": {
                                    bgcolor: "primary.main",
                                    opacity: 1,
                                },
                            },
                            "& .MuiSwitch-track": {
                                bgcolor: "border.light",
                                opacity: 1,
                            },
                        }}
                    />
                </Box>
            ))}
        </UiCard>
    );
}
