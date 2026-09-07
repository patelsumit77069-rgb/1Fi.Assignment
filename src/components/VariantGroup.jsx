import React from "react";
import { theme } from "../theme";
import { formatINR } from "../utils/formatCurrency";

export function VariantGroup({ group, selectedId, onSelect }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
        {group.label}
      </p>
      <div className="flex flex-wrap gap-2">
        {group.options.map((opt) => {
          const isActive = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(group.key, opt.id)}
              className="px-3.5 py-2 rounded-full text-sm font-semibold border"
              style={{
                background: isActive ? theme.purpleBrand : theme.card,
                color: isActive ? "#fff" : theme.text,
                borderColor: isActive ? theme.purpleBrand : theme.border,
              }}
            >
              {opt.label}
              {opt.priceDelta > 0 ? ` (+${formatINR(opt.priceDelta)})` : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
