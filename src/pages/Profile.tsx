import Box from "@mui/material/Box";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";
import ProfileCard from "../components/profile/ProfileCard";
import KycCard from "../components/profile/KycCard";
import PreferencesCard from "../components/profile/PreferencesCard";
import { useMember } from "../contexts/MemberContext";

export default function ProfilePage() {
  const { selectedMemberId, getProfileForMember } = useMember();
  const profile = getProfileForMember(selectedMemberId);

  const { members } = useMember();
  const displayMemberId = selectedMemberId === "all" ? "rajesh" : selectedMemberId;
  const memberName =
    members.find((m) => m.id === displayMemberId)?.name ?? "";

  if (!profile) return null;

  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          overflow: "hidden",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Welcome
            title="Profile & KYC"
            content="Your personal details and KYC verification status."
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <ProfileCard profile={profile} memberName={memberName} />
          <KycCard kycItems={profile.kyc} />
        </Box>

        <PreferencesCard />
      </Box>
    </AppLayout>
  );
}
