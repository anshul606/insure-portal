import { useState } from "react";
import Box from "@mui/material/Box";
import PolicyCard from "./PolicyCard";
import PolicyDetailModal from "./PolicyDetailModal";
import type { PolicyData } from "../../types/models";

export default function PolicyGrid({ policies }: { policies: PolicyData[] }) {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 1.25,
        }}
      >
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onClick={() => setSelectedPolicy(policy)}
          />
        ))}
      </Box>

      <PolicyDetailModal
        open={!!selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
        policy={selectedPolicy}
      />
    </>
  );
}
