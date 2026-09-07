import React from "react";
import { theme } from "../theme";

export function ShopHero() {
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

const TABS = [
  { id: "topBrands", label: "Top Brands" },
  { id: "nearbyStores", label: "Nearby Stores" },
  { id: "marketplace", label: "1Fi Marketplace" },
];

export function ShopTabs({ active, onChange }) {
  return (
    <div className="px-4 -mt-6 relative z-10">
      <div
        className="flex rounded-full p-1 gap-1 overflow-x-auto no-scrollbar"
        style={{ background: theme.purpleTint }}
      >
        {TABS.map((t) => {
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

export function BlankTabPlaceholder({ label }) {
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

export function BottomNav() {
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

export function ScreenHeader({ title, onBack }) {
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
