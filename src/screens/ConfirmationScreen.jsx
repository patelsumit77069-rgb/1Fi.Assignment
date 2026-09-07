import React, { useContext } from "react";
import { theme } from "../theme";
import { MarketplaceNavContext } from "../context/MarketplaceNavContext";
import { formatINR } from "../utils/formatCurrency";

export function ConfirmationScreen({ confirmed }) {
  const { resetToList } = useContext(MarketplaceNavContext);
  return (
    <div className="px-5 pt-10 pb-10 flex flex-col items-center text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
        style={{ background: "#E9F9EF" }}
      >
        ✅
      </div>
      <h2 className="font-extrabold text-xl" style={{ color: theme.text }}>
        Plan confirmed
      </h2>
      <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
        Order {confirmed.order.orderId}
      </p>

      <div
        className="w-full rounded-2xl p-4 mt-6 text-left"
        style={{ background: theme.card, border: `1px solid ${theme.border}` }}
      >
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: theme.textMuted }}>Product</span>
          <span className="font-semibold" style={{ color: theme.text }}>
            {confirmed.product.name}
          </span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: theme.textMuted }}>Total price</span>
          <span className="font-semibold" style={{ color: theme.text }}>
            {formatINR(confirmed.finalPrice)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: theme.textMuted }}>EMI plan</span>
          <span className="font-semibold" style={{ color: theme.text }}>
            {confirmed.selectedPlan.label} • {formatINR(confirmed.selectedPlan.monthlyAmount)}/mo
          </span>
        </div>
      </div>

      <button
        onClick={resetToList}
        className="w-full py-3.5 rounded-full font-bold text-white mt-6"
        style={{ background: theme.purpleBrand }}
      >
        Back to Marketplace
      </button>
      <p className="text-xs mt-3" style={{ color: theme.textMuted }}>
        Track repayments any time from the EMI Dues tab.
      </p>
    </div>
  );
}
