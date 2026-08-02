import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { ChevronDown, Search } from "lucide-react";
import UiCard from "../shared/UiCard";
import { api } from "../../services/api";
import { hasValidToken } from "../../services/apiClient";
import type { Faq } from "../../types/models";

const CATEGORIES = ["All", "Policies", "Claims", "Endorsements", "Tax", "App"];

export default function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadFaqs() {
      if (!hasValidToken()) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await api.getFaqs();
        setFaqs(data);
      } catch (err: any) {
        if (err?.status !== 401) {
          console.error("Failed to load FAQs:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      faq.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <UiCard sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
          Frequently Asked Questions
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          Quick answers to common questions before raising a ticket.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search questions or answers..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#9E9E9E" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: "surface.secondary" }
            }
          }}
        />

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  bgcolor: isSelected ? "primary.main" : "surface.secondary",
                  color: isSelected ? "primary.contrastText" : "text.secondary",
                  fontWeight: 600,
                  fontSize: 12,
                  "&:hover": {
                    bgcolor: isSelected ? "primary.dark" : "action.hover"
                  }
                }}
              />
            );
          })}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : filteredFaqs.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", py: 2 }}>
          No FAQs match your search.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {filteredFaqs.map((faq) => (
            <Accordion
              key={faq.id}
              elevation={0}
              disableGutters
              sx={{
                border: "1px solid",
                borderColor: "border.main",
                borderRadius: 2,
                "&:before": { display: "none" },
                overflow: "hidden"
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={18} />}
                sx={{
                  bgcolor: "surface.main",
                  "&.Mui-expanded": { bgcolor: "surface.secondary" }
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: "surface.main", borderTop: "1px solid", borderColor: "border.main" }}>
                <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.5 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </UiCard>
  );
}
