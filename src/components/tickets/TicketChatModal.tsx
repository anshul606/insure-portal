import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Drawer from "@mui/material/Drawer";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { X, Send, Paperclip } from "lucide-react";
import type { TicketData, ThreadMessage } from "../../types/models";
import { ticketStatusMap } from "../../contexts/InsuranceContext";
import { useTicket } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

type TicketChatModalProps = {
  open: boolean;
  onClose: () => void;
  ticket: TicketData | null;
};

export default function TicketChatModal({ open, onClose, ticket }: TicketChatModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { refreshTickets } = useTicket();
  const [message, setMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveTicket(ticket);
  }, [ticket]);

  const currentTicket = activeTicket || ticket;

  // Auto scroll to bottom when thread changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentTicket?.thread]);

  if (!currentTicket) return null;

  const st = ticketStatusMap[currentTicket.status as keyof typeof ticketStatusMap] || { label: currentTicket.statusDisplay || currentTicket.status, color: "#854F0B", bg: "#FAEEDA" };

  const handleSendReply = async () => {
    if (!message.trim() || sending) return;
    const text = message.trim();
    setMessage(""); // Clear input immediately for premium responsiveness
    setSending(true);

    const tempMsg: ThreadMessage = {
      from: "You",
      fromRole: "customer",
      timeDisplay: "Just now",
      message: text
    };

    const originalTicket = { ...currentTicket };

    // Optimistically append the message
    setActiveTicket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        thread: [...(prev.thread || []), tempMsg]
      };
    });

    try {
      await api.replyToTicket(currentTicket.id, text);
      const latest = await api.getTicketById(currentTicket.id);
      setActiveTicket(latest);
      await refreshTickets();
    } catch (err) {
      // Revert on error
      setActiveTicket(originalTicket);
      setMessage(text); // Restore typed text
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: isMobile ? "90vh" : 600 }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "border.main", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "surface.main" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.disabled", mb: 0.5, fontFamily: "monospace" }}>
            {currentTicket.ticketNumber}
          </Typography>
          <Typography noWrap sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
            {currentTicket.subject}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary", ml: 1.5, flexShrink: 0 }}>
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
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>{currentTicket.relatedPolicy || "General"}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: "text.disabled", textTransform: "uppercase" }}>Category</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>{currentTicket.category}</Typography>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, bgcolor: "#F8F9FC" }}>
        {currentTicket.thread && currentTicket.thread.length > 0 ? (
          currentTicket.thread.map((msg, idx) => {
            const isCustomer = msg.fromRole === "customer";
            return (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isCustomer ? "flex-end" : "flex-start",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
                  {!isCustomer && (
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "info.light", display: "flex", alignItems: "center", justifyContent: "center", color: "info.main", fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                      {msg.from.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                    </Box>
                  )}
                  <Box
                    sx={{
                      bgcolor: isCustomer ? "primary.main" : "surface.main",
                      color: isCustomer ? "primary.contrastText" : "text.primary",
                      border: isCustomer ? "none" : "1px solid",
                      borderColor: isCustomer ? "transparent" : "border.main",
                      p: 1.5,
                      borderRadius: 2,
                      borderBottomRightRadius: isCustomer ? 4 : 8,
                      borderBottomLeftRadius: isCustomer ? 8 : 4,
                    }}
                  >
                    {!isCustomer && (
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "info.main", mb: 0.5 }}>
                        {msg.from}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: 13, lineHeight: 1.4 }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "text.disabled",
                    mt: 0.5,
                    mr: isCustomer ? 1 : 0,
                    ml: isCustomer ? 0 : 4.5,
                  }}
                >
                  {msg.timeDisplay}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", opacity: 0.5 }}>
            <Typography sx={{ fontSize: 13 }}>No messages in this ticket thread yet.</Typography>
          </Box>
        )}
        <div ref={chatEndRef} />
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
            disabled={sending}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendReply();
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="small" sx={{ color: "text.disabled" }} disabled={sending}>
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
                      onClick={handleSendReply}
                      disabled={!message.trim() || sending}
                    >
                      {sending ? <CircularProgress size={14} color="inherit" /> : <Send size={16} />}
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            maxWidth: "460px",
          },
        },
      }}
    >
      {content}
    </Dialog>
  );
}
