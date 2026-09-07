import React from "react";
import { theme } from "../theme";
import { Badge } from "./Badge";
import { formatINR } from "../utils/formatCurrency";

export function EmiPlanCard({ plan, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(plan.id)}
      className="w-full text-left rounded-2xl p-4 mb-3 flex items-center justify-between"
      style={{
        background: isSelected ? theme.purpleTint : theme.card,
        border: `1.5px solid ${isSelected ? theme.purpleBrand : theme.border}`,
      }}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-bold" style={{ color: theme.text }}>
            {plan.label}
          </p>
          {plan.tag && <Badge tone="green">{plan.tag}</Badge>}
        </div>
        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
          {formatINR(plan.monthlyAmount)}/mo • 0% interest • no processing fee
        </p>
      </div>
      <div
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{ borderColor: isSelected ? theme.purpleBrand : "#C9C4DA" }}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.purpleBrand }} />
        )}
      </div>
    </button>
  );
}
