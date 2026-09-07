import React, { useState, useEffect, useCallback, useContext } from "react";
import { theme } from "../theme";
import { marketplaceApi } from "../api/marketplaceApi";
import { MarketplaceNavContext } from "../context/MarketplaceNavContext";
import { Badge } from "../components/Badge";
import { Skeleton, ErrorState, EmptyState } from "../components/StatusStates";
import { ProductCard } from "../components/ProductCard";

export function MarketplaceListScreen() {
  const { goToDetail } = useContext(MarketplaceNavContext);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const load = useCallback((q) => {
    setStatus("loading");
    marketplaceApi
      .fetchProducts({ query: q })
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, []);

  // Debounce search input so we don't fire an API call per keystroke.
  useEffect(() => {
    const handle = setTimeout(() => load(query), query ? 300 : 0);
    return () => clearTimeout(handle);
  }, [query, load]);

  return (
    <div className="px-4 pt-4">
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-full mb-4"
        style={{ background: theme.card, border: `1px solid ${theme.border}` }}
      >
        <span style={{ color: theme.textMuted }}>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: theme.text }}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg" style={{ color: theme.text }}>
          1Fi Marketplace
        </h2>
        <Badge tone="purple">{products.length || ""} items</Badge>
      </div>

      {status === "loading" && (
        <div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 mb-3">
              <Skeleton className="w-16 h-16" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === "error" && <ErrorState message={errorMsg} onRetry={() => load(query)} />}

      {status === "success" && products.length === 0 && (
        <EmptyState text={`No products match "${query}"`} />
      )}

      {status === "success" &&
        products.map((p) => <ProductCard key={p.id} product={p} onSelect={goToDetail} />)}
    </div>
  );
}
