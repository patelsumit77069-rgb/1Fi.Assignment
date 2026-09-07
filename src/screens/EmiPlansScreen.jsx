import React, { useState, useEffect, useCallback, useContext } from "react";
import { theme } from "../theme";
import { marketplaceApi } from "../api/marketplaceApi";
import { MarketplaceNavContext } from "../context/MarketplaceNavContext";
import { Skeleton, ErrorState } from "../components/StatusStates";
import { EmiPlanCard } from "../components/EmiPlanCard";
import { formatINR } from "../utils/formatCurrency";

export function EmiPlansScreen({ cartDraft }) {
  const { goToConfirm } = useContext(MarketplaceNavContext);
  const [status, setStatus] = useState("loading");
  const [plans, setPlans] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    marketplaceApi
      .fetchEmiPlans({ productId: cartDraft.product.id, finalPrice: cartDraft.finalPrice })
      .then((data) => {
        setPlans(data);
        setSelectedPlanId(data[0]?.id ?? null);
        setStatus("success");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [cartDraft]);

  useEffect(() => {
    load();
  }, [load]);

  const handleProceed = async () => {
    setSubmitting(true);
    try {
      const result = await marketplaceApi.confirmPlan({
        productId: cartDraft.product.id,
        variantSelection: cartDraft.selection,
        emiPlanId: selectedPlanId,
      });
      const selectedPlan = plans.find((p) => p.id === selectedPlanId);
      goToConfirm({ ...cartDraft, selectedPlan, order: result });
    } catch (e) {
      setErrorMsg("Could not confirm your plan. Please try again.");
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="px-4 pt-2 pb-28">
        <div
          className="rounded-2xl p-3 flex items-center gap-3 mb-5"
          style={{ background: theme.badgeBg }}
        >
          <div className="text-3xl">{cartDraft.product.emoji}</div>
          <div>
            <p className="font-bold text-sm" style={{ color: theme.text }}>
              {cartDraft.product.name}
            </p>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              {formatINR(cartDraft.finalPrice)} total
            </p>
          </div>
        </div>

        <p className="font-bold mb-3" style={{ color: theme.text }}>
          Choose your EMI plan
        </p>

        {status === "loading" &&
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full mb-3" />)}

        {status === "error" && <ErrorState message={errorMsg} onRetry={load} />}

        {status === "success" &&
          plans.map((plan) => (
            <EmiPlanCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === selectedPlanId}
              onSelect={setSelectedPlanId}
            />
          ))}
      </div>

      {status === "success" && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto px-4 py-3 border-t"
          style={{ background: theme.card, borderColor: theme.border }}
        >
          <button
            onClick={handleProceed}
            disabled={!selectedPlanId || submitting}
            className="w-full py-3.5 rounded-full font-bold text-white flex items-center justify-center gap-2"
            style={{ background: theme.purpleBrand, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Confirming…" : "Proceed with this plan"}
          </button>
        </div>
      )}
    </div>
  );
}
