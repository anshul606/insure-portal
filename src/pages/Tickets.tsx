import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from "lucide-react";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import TicketForm from "../components/tickets/TicketForm";
import TicketsList from "../components/tickets/TicketsList";
import TicketChatModal from "../components/tickets/TicketChatModal";
import FaqSection from "../components/tickets/FaqSection";
import { useTicket } from "../contexts/InsuranceContext";
import TableSkeleton from "../components/shared/TableSkeleton";
import type { TicketData } from "../types/models";

export default function TicketsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const { loading } = useTicket();

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "flex-start" },
            justifyContent: "space-between",
            mb: 2,
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
            <Welcome
                title="Support Tickets"
                content="Raise and track service requests with your advisor team."
                hideMemberSelector
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<Plus size={14} />}
            onClick={() => setShowForm(!showForm)}
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
              flexShrink: 0,
              "&:hover": {
                bgcolor: "info.light",
                opacity: 0.9,
                boxShadow: "none",
              },
            }}
          >
            New Ticket
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
            {showForm && (
                <Box sx={{ mb: 3, maxWidth: 800 }}>
                    <TicketForm onCancel={() => setShowForm(false)} />
                </Box>
            )}

            {loading ? (
              <TableSkeleton />
            ) : (
              <TicketsList onViewClick={(ticket) => setSelectedTicket(ticket)} />
            )}

            <FaqSection />
        </Box>

        <TicketChatModal 
            open={!!selectedTicket} 
            onClose={() => setSelectedTicket(null)} 
            ticket={selectedTicket} 
        />
      </Box>
    </AppLayout>
  );
}
