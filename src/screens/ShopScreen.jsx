import React, { useState } from "react";
import { ShopHero, ShopTabs, BlankTabPlaceholder, BottomNav } from "../components/ShopShell";
import { MarketplaceTab } from "./MarketplaceTab";
import { theme } from "../theme";

export function ShopScreen() {
  const [activeTab, setActiveTab] = useState("marketplace");

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#DCD9E8" }}>
      <div
        className="w-full min-h-screen flex flex-col"
        style={{ background: theme.bg }}>
        <ShopHero />
        <ShopTabs active={activeTab} onChange={setActiveTab} />
        <div className="flex-1 pt-4">
          {activeTab === "topBrands" && <BlankTabPlaceholder label="Top Brands" />}
          {activeTab === "nearbyStores" && <BlankTabPlaceholder label="Nearby Stores" />}
          {activeTab === "marketplace" && <MarketplaceTab />}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
