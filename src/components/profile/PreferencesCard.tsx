import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { api } from "../../services/api";
import type { Preferences } from "../../types/models";

type PreferenceItem = {
  label: string;
  category: "channels" | "categories";
  key: string;
};

const items: PreferenceItem[] = [
  { label: "Renewal reminders via Email", category: "channels", key: "email" },
  { label: "Renewal reminders via SMS", category: "channels", key: "sms" },
  { label: "Claim updates via WhatsApp", category: "channels", key: "whatsapp" },
  { label: "Push notifications", category: "channels", key: "push" },
  { label: "Payment Reminders", category: "categories", key: "paymentReminders" },
  { label: "Promotions & Offers", category: "categories", key: "promotions" },
];

export default function PreferencesCard({ memberId }: { memberId?: string }) {
  const [prefs, setPrefs] = useState<Preferences>({
    channels: { email: true, sms: true, whatsapp: false, push: true },
    categories: { renewalReminders: true, claimUpdates: true, paymentReminders: true, promotions: false },
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const targetId = memberId;
    if (!targetId) return;
    async function fetchPrefs(id: string) {
      try {
        const data = await api.getMemberPreferences(id);
        if (data) setPrefs(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPrefs(targetId);
  }, [memberId]);

  const handleToggle = async (category: "channels" | "categories", key: string, value: boolean) => {
    const updated: Preferences = {
      ...prefs,
      [category]: {
        ...(prefs[category] || {}),
        [key]: value,
      },
    };
    setPrefs(updated);
    if (!memberId) return;

    setSaving(true);
    setMsg(null);
    try {
      await api.updateMemberPreferences(memberId, updated);
      setMsg("Preferences saved!");
      setTimeout(() => setMsg(null), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <UiCard>
      <Typography
        sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", mb: 1 }}
      >
        Communication Preferences
      </Typography>

      {msg && (
        <Alert severity="success" sx={{ mb: 1, fontSize: 11, py: 0 }}>
          {msg}
        </Alert>
      )}

      {items.map((item) => {
        const catObj = prefs[item.category] as Record<string, boolean> | undefined;
        const isChecked = catObj ? Boolean(catObj[item.key]) : false;

        return (
          <Box
            key={`${item.category}-${item.key}`}
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
              checked={isChecked}
              disabled={saving}
              onChange={(e) => handleToggle(item.category, item.key, e.target.checked)}
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
        );
      })}
    </UiCard>
  );
}
