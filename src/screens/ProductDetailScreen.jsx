import React, { useState, useEffect, useCallback, useContext } from "react";
import { theme } from "../theme";
import { marketplaceApi } from "../api/marketplaceApi";
import { MarketplaceNavContext } from "../context/MarketplaceNavContext";
import { Badge } from "../components/Badge";
import { Skeleton, ErrorState } from "../components/StatusStates";
import { VariantGroup } from "../components/VariantGroup";
import { formatINR } from "../utils/formatCurrency";

export function ProductDetailScreen({ productId }) {
  const { goToPlans } = useContext(MarketplaceNavContext);
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selection, setSelection] = useState({});

  const load = useCallback(() => {
    setStatus("loading");
    marketplaceApi
      .fetchProductDetail(productId)
      .then((data) => {
        setProduct(data);
        const initial = {};
        data.variantGroups.forEach((g) => (initial[g.key] = g.options[0].id));
        setSelection(initial);
        setStatus("success");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return (
      <div className="px-4 pt-2">
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-5 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }
  if (status === "error") {
    return <ErrorState message={errorMsg} onRetry={load} />;
  }

  const finalPrice =
    product.basePrice +
    product.variantGroups.reduce((sum, g) => {
      const chosen = g.options.find((o) => o.id === selection[g.key]);
      return sum + (chosen ? chosen.priceDelta : 0);
    }, 0);

  return (
    <div>
      <div
        className="h-44 flex items-center justify-center text-7xl"
        style={{ background: theme.purpleTint }}
      >
        {product.emoji}
      </div>
      <div className="px-4 pt-4 pb-28">
        <p className="text-xs font-semibold" style={{ color: theme.textMuted }}>
          {product.brand} • {product.category}
        </p>
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-xl" style={{ color: theme.text }}>
            {product.name}
          </h2>
          <Badge>★ {product.rating}</Badge>
        </div>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: theme.textMuted }}>
          {product.description}
        </p>

        <div className="mt-4 mb-5">
          <span className="font-extrabold text-2xl" style={{ color: theme.text }}>
            {formatINR(finalPrice)}
          </span>
        </div>

        {product.variantGroups.map((g) => (
          <VariantGroup
            key={g.key}
            group={g}
            selectedId={selection[g.key]}
            onSelect={(key, val) => setSelection((s) => ({ ...s, [key]: val }))}
          />
        ))}

        <div
          className="rounded-2xl p-3 flex items-center gap-2 mt-2"
          style={{ background: theme.purpleTint }}
        >
          <span>✨</span>
          <p className="text-xs font-semibold" style={{ color: theme.purpleBrand }}>
            No credit score required — EMI backed by your mutual fund investments
          </p>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto px-4 py-3 border-t"
        style={{ background: theme.card, borderColor: theme.border }}
      >
        <button
          onClick={() => goToPlans({ product, selection, finalPrice })}
          className="w-full py-3.5 rounded-full font-bold text-white"
          style={{ background: theme.purpleBrand }}
        >
          View EMI plans
        </button>
      </div>
    </div>
  );
}
