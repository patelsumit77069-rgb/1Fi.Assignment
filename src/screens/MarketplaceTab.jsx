import React, { useState } from "react";
import { MarketplaceNavContext } from "../context/MarketplaceNavContext";
import { ScreenHeader } from "../components/ShopShell";
import { MarketplaceListScreen } from "./MarketplaceListScreen";
import { ProductDetailScreen } from "./ProductDetailScreen";
import { EmiPlansScreen } from "./EmiPlansScreen";
import { ConfirmationScreen } from "./ConfirmationScreen";

// Marketplace has its own tiny navigation stack (list -> detail -> plans ->
// confirm) that lives entirely inside this one Shop tab, independent of
// whatever router the rest of the app uses.
export function MarketplaceTab() {
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
      {screen.name === "confirm" && <ConfirmationScreen confirmed={screen.confirmed} />}
    </MarketplaceNavContext.Provider>
  );
}
