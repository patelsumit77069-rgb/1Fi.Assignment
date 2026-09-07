import React from "react";
import { theme } from "../theme";
import { Badge } from "./Badge";
import { formatINR } from "../utils/formatCurrency";

export function ProductCard({ product, onSelect }) {
  const minEmi = Math.ceil(product.basePrice / Math.max(...product.tenureOptions));
  return (
    <button
      onClick={() => onSelect(product.id)}
      className="w-full text-left rounded-2xl p-3 flex gap-3 items-center mb-3 active:scale-[0.99] transition-transform"
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 1px 2px rgba(20,10,50,0.04)",
      }}
    >
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
        style={{ background: theme.badgeBg }}
      >
        {product.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
              {product.brand}
            </p>
            <p className="font-bold truncate" style={{ color: theme.text }}>
              {product.name}
            </p>
          </div>
          <Badge>★ {product.rating}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-bold text-sm" style={{ color: theme.text }}>
            {formatINR(product.basePrice)}
          </span>
          <Badge tone="purple">EMI from {formatINR(minEmi)}/mo</Badge>
        </div>
      </div>
    </button>
  );
}
