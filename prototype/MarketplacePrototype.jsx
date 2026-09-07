import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

/* ============================================================================
   1Fi MARKETPLACE — interactive prototype
   Matches the existing Shop page (purple hero, pill tabs, white list cards,
   bottom nav). "Top Brands" and "Nearby Stores" are left as-is (per spec,
   no implementation required). "1Fi Marketplace" is fully built out below:
   listing -> product detail -> variant select -> EMI plan select -> confirm.

   Data flow is meant to model what a real app would do: components call a
   mock "API" module (marketplaceApi) that returns Promises, so swapping
   mock data for real endpoints later only means editing marketplaceApi.js.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   THEME — pulled from the existing app screens (hero purple, card radius,
   badge grey, nav states) so the new section doesn't invent its own look.
--------------------------------------------------------------------------- */
const theme = {
  purple900: "#2B0F6E",
  purple700: "#4B21E2",
  purpleBrand: "#5B2EFF",
  purpleTint: "#EDE9FE",
  bg: "#F5F4F8",
  card: "#FFFFFF",
  text: "#161221",
  textMuted: "#6B7280",
  badgeBg: "#F1F0F4",
  border: "#ECEAF3",
  green: "#16A34A",
  red: "#DC2626",
};

/* ---------------------------------------------------------------------------
   MOCK DATA — stands in for a product/EMI catalog service. Nothing in the
   components below is hardcoded from here directly; everything goes through
   the api layer so loading/error states are real, not simulated visually.
--------------------------------------------------------------------------- */
const PRODUCTS_DB = [
  {
    id: "p1",
    name: "iPhone 15",
    brand: "Apple",
    category: "Smartphones",
    emoji: "📱",
    basePrice: 79900,
    rating: 4.7,
    description:
      "6.1-inch Super Retina XDR display, A16 Bionic chip, 48MP main camera with 2x Telephoto.",
    variantGroups: [
      {
        key: "storage",
        label: "Storage",
        options: [
          { id: "128gb", label: "128GB", priceDelta: 0 },
          { id: "256gb", label: "256GB", priceDelta: 10000 },
          { id: "512gb", label: "512GB", priceDelta: 30000 },
        ],
      },
      {
        key: "color",
        label: "Colour",
        options: [
          { id: "black", label: "Black", priceDelta: 0 },
          { id: "blue", label: "Blue", priceDelta: 0 },
          { id: "pink", label: "Pink", priceDelta: 0 },
        ],
      },
    ],
    tenureOptions: [3, 6, 9, 12],
  },
  {
    id: "p2",
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptops",
    emoji: "💻",
    basePrice: 114900,
    rating: 4.8,
    description:
      "13.6-inch Liquid Retina display, M2 chip with 8-core CPU, up to 18 hours battery life.",
    variantGroups: [
      {
        key: "storage",
        label: "Storage",
        options: [
          { id: "256gb", label: "256GB", priceDelta: 0 },
          { id: "512gb", label: "512GB", priceDelta: 20000 },
        ],
      },
      {
        key: "color",
        label: "Colour",
        options: [
          { id: "midnight", label: "Midnight", priceDelta: 0 },
          { id: "starlight", label: "Starlight", priceDelta: 0 },
        ],
      },
    ],
    tenureOptions: [3, 6, 9, 12],
  },
  {
    id: "p3",
    name: "WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    emoji: "🎧",
    basePrice: 29990,
    rating: 4.6,
    description:
      "Industry-leading noise cancellation, 30-hour battery, multipoint Bluetooth connection.",
    variantGroups: [
      {
        key: "color",
        label: "Colour",
        options: [
          { id: "black", label: "Black", priceDelta: 0 },
          { id: "silver", label: "Silver", priceDelta: 0 },
        ],
      },
    ],
    tenureOptions: [3, 6, 9],
  },
  {
    id: "p4",
    name: "55\" QNED TV",
    brand: "LG",
    category: "Televisions",
    emoji: "📺",
    basePrice: 64990,
    rating: 4.5,
    description:
      "4K UHD QNED panel, webOS smart platform, Dolby Vision & Atmos, 3 HDMI 2.1 ports.",
    variantGroups: [
      {
        key: "size",
        label: "Screen size",
        options: [
          { id: "50in", label: "50\"", priceDelta: -8000 },
          { id: "55in", label: "55\"", priceDelta: 0 },
          { id: "65in", label: "65\"", priceDelta: 25000 },
        ],
      },
    ],
    tenureOptions: [3, 6, 9, 12],
  },
  {
    id: "p5",
    name: "Classic 350",
    brand: "Royal Enfield",
    category: "Two-wheelers",
    emoji: "🏍️",
    basePrice: 193000,
    rating: 4.6,
    description:
      "349cc single-cylinder engine, twin downtube spine frame, dual-channel ABS.",
    variantGroups: [
      {
        key: "color",
        label: "Colour",
        options: [
          { id: "stealth-black", label: "Stealth Black", priceDelta: 0 },
          { id: "redditch-red", label: "Redditch Red", priceDelta: 4000 },
          { id: "chrome", label: "Chrome", priceDelta: 12000 },
        ],
      },
    ],
    tenureOptions: [6, 12, 24, 36],
  },
];

/* ---------------------------------------------------------------------------
   MOCK API LAYER — every "network" call. Introduces latency + an occasional
   failure so the UI has to genuinely handle loading/error/empty states
   rather than assuming happy-path data.
--------------------------------------------------------------------------- */
const networkDelay = (ms = 650) => new Promise((res) => setTimeout(res, ms));

// flip to true occasionally to see the error state in the demo
let FAIL_NEXT_DETAIL_CALL = false;

const marketplaceApi = {
  async fetchProducts({ query = "" } = {}) {
    await networkDelay(700);
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS_DB;
    return PRODUCTS_DB.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  },

  async fetchProductDetail(productId) {
    await networkDelay(500);
    if (FAIL_NEXT_DETAIL_CALL) {
      FAIL_NEXT_DETAIL_CALL = false;
      const err = new Error("Could not load product details");
      throw err;
    }
    const product = PRODUCTS_DB.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");
    return product;
  },

  // EMI math lives server-side in a real system (rates, eligibility, min
  // ticket size per tenure). Modelled here as a pure function of price.
  async fetchEmiPlans({ productId, finalPrice }) {
    await networkDelay(450);
    const product = PRODUCTS_DB.find((p) => p.id === productId);
    if (!product) throw new Error("Could not load EMI plans");
    return product.tenureOptions.map((months) => ({
      id: `${productId}-${months}`,
      tenureMonths: months,
      monthlyAmount: Math.ceil(finalPrice / months),
      totalPayable: finalPrice,
      interestRate: 0,
      processingFee: 0,
      label: `${months} months`,
      tag: months <= 6 ? "Most popular" : null,
    }));
  },

  async confirmPlan({ productId, variantSelection, emiPlanId }) {
    await networkDelay(900);
    return {
      orderId: `1FI-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "confirmed",
      productId,
      variantSelection,
      emiPlanId,
    };
  },
};

/* ---------------------------------------------------------------------------
   Small formatting helper
--------------------------------------------------------------------------- */
const formatINR = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

/* ---------------------------------------------------------------------------
   Marketplace state — kept in a context so the list/detail/plan/confirm
   screens don't have to thread props through every level, but nothing
   here is global app state beyond this one feature.
--------------------------------------------------------------------------- */
const MarketplaceNavContext = createContext(null);

/* ---------------------------------------------------------------------------
   Shared UI atoms, styled to match the existing app (rounded-2xl white
   cards, soft shadow, grey pill badges, purple brand accent).
--------------------------------------------------------------------------- */
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "#E9E7F0" }}
    />
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
        style={{ background: "#FDEDED" }}
      >
        ⚠️
      </div>
      <p className="font-semibold" style={{ color: theme.text }}>
        Something didn't load
      </p>
      <p className="text-sm mt-1 mb-4" style={{ color: theme.textMuted }}>
        {message || "Please check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-full font-semibold text-sm text-white"
        style={{ background: theme.purpleBrand }}
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div className="text-3xl mb-2">🔍</div>
      <p className="text-sm" style={{ color: theme.textMuted }}>
        {text}
      </p>
    </div>
  );
}

function Badge({ children, tone = "default" }) {
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

/* ---------------------------------------------------------------------------
   SHOP PAGE SHELL — hero + 3-way pill tab switcher (Top Brands / Nearby
   Stores / 1Fi Marketplace). First two stay blank placeholders per spec.
--------------------------------------------------------------------------- */
function ShopHero() {
  return (
    <div
      className="relative overflow-hidden px-5 pt-6 pb-10"
      style={{
        background:
          "radial-gradient(120% 100% at 78% 0%, #6D3CF2 0%, #4218C4 45%, #2B0F6E 100%)",
      }}
    >
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4"
        style={{ border: "1px solid rgba(255,255,255,0.35)" }}
      >
        <span className="text-xs">✨</span>
        <span className="text-[11px] font-bold tracking-wide text-white">
          NO-COST EMIs
        </span>
      </div>
      <h1 className="text-white text-[28px] leading-tight font-extrabold max-w-[70%]">
        Shop today,
        <br />
        <span className="italic font-semibold">Pay later using</span>
        <br />
        Mutual funds.
      </h1>
      <p className="text-[13px] mt-3 max-w-[75%]" style={{ color: "#D9D3F7" }}>
        No credit score required. No interest. Backed by your investments.
      </p>
      <div className="absolute -right-2 top-8 text-6xl select-none opacity-95">
        🛍️
      </div>
    </div>
  );
}

function ShopTabs({ active, onChange }) {
  const tabs = [
    { id: "topBrands", label: "Top Brands" },
    { id: "nearbyStores", label: "Nearby Stores" },
    { id: "marketplace", label: "1Fi Marketplace" },
  ];
  return (
    <div className="px-4 -mt-6 relative z-10">
      <div
        className="flex rounded-full p-1 gap-1 overflow-x-auto no-scrollbar"
        style={{ background: theme.purpleTint }}
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="flex-1 min-w-[110px] px-3 py-2.5 rounded-full text-[13px] font-bold transition-colors"
              style={{
                background: isActive ? theme.card : "transparent",
                color: isActive ? theme.purpleBrand : "#7C7593",
                boxShadow: isActive ? "0 1px 3px rgba(43,15,110,0.12)" : "none",
              }}
            >
              {t.label}
              {isActive && (
                <div
                  className="h-[2.5px] w-6 rounded-full mx-auto mt-1"
                  style={{ background: theme.purpleBrand }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BlankTabPlaceholder({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-3"
        style={{ background: theme.badgeBg }}
      >
        🚧
      </div>
      <p className="font-semibold" style={{ color: theme.text }}>
        {label}
      </p>
      <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
        Not part of this build — placeholder per the assignment spec.
      </p>
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: "🏠", label: "Home" },
    { icon: "🛍️", label: "Shop", active: true },
    { icon: "🧾", label: "EMI Dues" },
    { icon: "📈", label: "Limit" },
    { icon: "👤", label: "Profile" },
  ];
  return (
    <div
      className="flex items-center justify-around py-2.5 border-t"
      style={{ background: theme.card, borderColor: theme.border }}
    >
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-0.5 px-2">
          {it.active && (
            <div
              className="w-6 h-[2.5px] rounded-full mb-1"
              style={{ background: theme.purpleBrand }}
            />
          )}
          <span className="text-lg leading-none">{it.icon}</span>
          <span
            className="text-[10px] font-medium"
            style={{ color: it.active ? theme.purpleBrand : "#9C96AC" }}
          >
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MARKETPLACE — LISTING SCREEN
--------------------------------------------------------------------------- */
function ProductCard({ product, onSelect }) {
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

function MarketplaceListScreen() {
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

  useEffect(() => {
    const handle = setTimeout(() => load(query), query ? 300 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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

      {status === "error" && (
        <ErrorState message={errorMsg} onRetry={() => load(query)} />
      )}

      {status === "success" && products.length === 0 && (
        <EmptyState text={`No products match "${query}"`} />
      )}

      {status === "success" &&
        products.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={goToDetail} />
        ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MARKETPLACE — PRODUCT DETAIL + VARIANT SELECTION
--------------------------------------------------------------------------- */
function VariantGroup({ group, selectedId, onSelect }) {
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

function ScreenHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: theme.badgeBg }}
      >
        ←
      </button>
      <p className="font-bold text-base truncate" style={{ color: theme.text }}>
        {title}
      </p>
    </div>
  );
}

function ProductDetailScreen({ productId }) {
  const { goBack, goToPlans } = useContext(MarketplaceNavContext);
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

/* ---------------------------------------------------------------------------
   MARKETPLACE — EMI PLAN SELECTION
--------------------------------------------------------------------------- */
function EmiPlanCard({ plan, isSelected, onSelect }) {
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
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: theme.purpleBrand }}
          />
        )}
      </div>
    </button>
  );
}

function EmiPlansScreen({ cartDraft }) {
  const { goBack, goToConfirm } = useContext(MarketplaceNavContext);
  const [status, setStatus] = useState("loading");
  const [plans, setPlans] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    marketplaceApi
      .fetchEmiPlans({
        productId: cartDraft.product.id,
        finalPrice: cartDraft.finalPrice,
      })
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
            style={{
              background: theme.purpleBrand,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Confirming…" : "Proceed with this plan"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MARKETPLACE — CONFIRMATION
--------------------------------------------------------------------------- */
function ConfirmationScreen({ confirmed }) {
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

/* ---------------------------------------------------------------------------
   MARKETPLACE ROOT — owns the mini navigation stack for this one tab only.
--------------------------------------------------------------------------- */
function MarketplaceTab() {
  const [screen, setScreen] = useState({ name: "list" });

  const nav = {
    goToDetail: (productId) => setScreen({ name: "detail", productId }),
    goBack: () => setScreen({ name: "list" }),
    goToPlans: (cartDraft) => setScreen({ name: "plans", cartDraft }),
    goToConfirm: (confirmed) => setScreen({ name: "confirm", confirmed }),
    resetToList: () => setScreen({ name: "list" }),
  };

  return (
    <MarketplaceNavContext.Provider value={nav}>
      {screen.name === "list" && <MarketplaceListScreen />}
      {screen.name === "detail" && (
        <>
          <ScreenHeader title="Product details" onBack={nav.goBack} />
          <ProductDetailScreen productId={screen.productId} />
        </>
      )}
      {screen.name === "plans" && (
        <>
          <ScreenHeader
            title="EMI plans"
            onBack={() => nav.goToDetail(screen.cartDraft.product.id)}
          />
          <EmiPlansScreen cartDraft={screen.cartDraft} />
        </>
      )}
      {screen.name === "confirm" && (
        <ConfirmationScreen confirmed={screen.confirmed} />
      )}
    </MarketplaceNavContext.Provider>
  );
}

/* ---------------------------------------------------------------------------
   APP ROOT
--------------------------------------------------------------------------- */
export default function App() {
  const [activeTab, setActiveTab] = useState("marketplace");

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#DCD9E8" }}>
      <div
        className="w-full max-w-[420px] min-h-screen flex flex-col"
        style={{ background: theme.bg }}
      >
        <ShopHero />
        <ShopTabs active={activeTab} onChange={setActiveTab} />
        <div className="flex-1 pt-4">
          {activeTab === "topBrands" && (
            <BlankTabPlaceholder label="Top Brands" />
          )}
          {activeTab === "nearbyStores" && (
            <BlankTabPlaceholder label="Nearby Stores" />
          )}
          {activeTab === "marketplace" && <MarketplaceTab />}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
