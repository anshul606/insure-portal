import { Heart, Car, Shield, Home, Plane, FileText } from "lucide-react";
import type { ReactNode } from "react";

export type IconConfig = {
  icon: ReactNode;
  iconBg: string;
  borderColor?: string;
  renewDateColor?: string;
};

/**
 * Maps a policy's `category` and `status` to its icon + UI colours.
 * Icons are a front-end concern — the API never returns them.
 */
export function getIconForCategory(category?: string, status?: string): IconConfig {
  if (status === "external") {
    return { icon: <FileText size={19} />, iconBg: "#F1EFE8" };
  }

  switch (category?.toLowerCase()) {
    case "health":
      return { icon: <Heart size={19} />, iconBg: "#EAF3DE" };
    case "motor":
      return {
        icon: <Car size={19} />,
        iconBg: "#FAEEDA",
        borderColor: status === "due" ? "#FAC775" : undefined,
        renewDateColor: status === "due" ? "#854F0B" : undefined,
      };
    case "life":
      return { icon: <Shield size={19} />, iconBg: "#EBF3FC" };
    case "home":
      return { icon: <Home size={19} />, iconBg: "#F9E8FC" };
    case "travel":
      return { icon: <Plane size={19} />, iconBg: "#E8F9FC" };
    default:
      return { icon: <Shield size={19} />, iconBg: "#EBF3FC" };
  }
}

/**
 * Formats a numeric sum insured into a short display string.
 * e.g. 10000000 → "₹1Cr", 2500000 → "₹25L", 50000 → "₹50,000"
 */
export function formatSumInsuredShort(sum: number): string {
  if (sum >= 10000000) {
    const cr = sum / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)}Cr`;
  } else if (sum >= 100000) {
    const l = sum / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`;
  }
  return `₹${sum.toLocaleString("en-IN")}`;
}

/**
 * Builds a short coverage text based on policy category.
 * e.g. motor → "IDV: ₹8.5L", life → "SA: ₹1Cr", health → "₹25L"
 */
export function getCoverageText(category?: string, sumInsured?: number): string {
  if (!sumInsured) return "—";
  const shortSum = formatSumInsuredShort(sumInsured);
  if (category?.toLowerCase() === "motor") {
    return `IDV: ${shortSum}`;
  }
  if (category?.toLowerCase() === "life") {
    return `SA: ${shortSum}`;
  }
  return shortSum;
}
