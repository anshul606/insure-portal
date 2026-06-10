import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Drawer from "@mui/material/Drawer";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { X, Send, Paperclip } from "lucide-react";
import type { TicketData } from "../../types/models";
import { ticketStatusMap } from "../../contexts/InsuranceContext";

type TicketChatModalProps = {
  open: boolean;
  onClose: () => void;
  ticket: TicketData | null;
};

export default function TicketChatModal({ open, onClose, ticket }: TicketChatModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [message, setMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);

  useEffect(() => {
    if (ticket) {
      setActiveTicket(ticket);
    }
  }, [ticket]);

  const currentTicket = ticket || activeTicket;

  if (!currentTicket) return null;

  const st = ticketStatusMap[currentTicket.status as keyof typeof ticketStatusMap];

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: isMobile ? "90vh" : 600 }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "border.main", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "surface.main" }}>
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.disabled", mb: 0.5, fontFamily: "monospace" }}>
            {currentTicket.ticketNumber}
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
            {currentTicket.subject}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Ticket Details Summary */}
      <Box sx={{ p: 2, bgcolor: "surface.secondary", borderBottom: "1px solid", borderColor: "border.main", display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: "text.disabled", textTransform: "uppercase" }}>Status</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: st.color }}>{st.label}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: "text.disabled", textTransform: "uppercase" }}>Policy</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>{currentTicket.policyName || "General"}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: "text.disabled", textTransform: "uppercase" }}>Category</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>{currentTicket.category}</Typography>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, bgcolor: "#F8F9FC" }}>
        {/* User Message */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
            <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: 1.5, borderRadius: 2, borderBottomRightRadius: 4 }}>
              <Typography sx={{ fontSize: 13, lineHeight: 1.4 }}>
                I need an update on this issue. I uploaded the documents yesterday.
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 0.5, mr: 1 }}>
            Yesterday, 10:30 AM
          </Typography>
        </Box>

        {/* Advisor Message */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
            <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "info.light", display: "flex", alignItems: "center", justifyContent: "center", color: "info.main", fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
              AM
            </Box>
            <Box sx={{ bgcolor: "surface.main", border: "1px solid", borderColor: "border.main", p: 1.5, borderRadius: 2, borderBottomLeftRadius: 4 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "info.main", mb: 0.5 }}>
                Arjun Mehta (Advisor)
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.primary", lineHeight: 1.4 }}>
                Hello, I have reviewed the documents. We have forwarded them to the insurer and are awaiting final confirmation. I will update you by tomorrow noon.
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 0.5, ml: 4.5 }}>
            Today, 09:15 AM
          </Typography>
        </Box>
      </Box>

      {/* Input Area */}
      {currentTicket.status !== "resolved" && (
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "border.main", bgcolor: "surface.main" }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="small" sx={{ color: "text.disabled" }}>
                      <Paperclip size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ bgcolor: message.trim() ? "primary.main" : "transparent", color: message.trim() ? "white" : "primary.main", "&:hover": { bgcolor: "primary.dark", color: "white" } }}
                      onClick={() => {
                          if(message.trim()) {
                              alert("Message sent!");
                              setMessage("");
                          }
                      }}
                    >
                      <Send size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 4, bgcolor: "surface.secondary", "& fieldset": { borderColor: "transparent" } }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 20 }}
        slotProps={{
          paper: {
            sx: { borderRadius: "16px 16px 0 0" }
          }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
          <Box sx={{ width: 40, height: 4, bgcolor: "grey.300", borderRadius: 2 }} />
        </Box>
        {content}
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      {content}
    </Dialog>
  );
}
