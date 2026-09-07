import React from "react";
import { theme } from "../theme";

export function Badge({ children, tone = "default" }) {
  const tones = {
    default: { background: theme.badgeBg, color: theme.textMuted },
    purple: { background: theme.purpleTint, color: theme.purpleBrand },
    green: { background: "#E9F9EF", color: theme.green },
  };
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={tones[tone]}
    >
      {children}
    </span>
  );
}
