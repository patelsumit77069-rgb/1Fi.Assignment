import { PRODUCTS_DB } from "../data/products";

// Simulated network latency. Swap this whole file for real `fetch` calls
// against a backend and no screen or component needs to change, since
// they only ever depend on the shape of the resolved/rejected Promise.
const networkDelay = (ms = 650) => new Promise((res) => setTimeout(res, ms));

// Flip true to preview the error state for the product-detail screen.
let FAIL_NEXT_DETAIL_CALL = false;

export const marketplaceApi = {
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
      throw new Error("Could not load product details");
    }
    const product = PRODUCTS_DB.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");
    return product;
  },

  // EMI math (rates, eligibility per tenure) belongs server-side in a real
  // system. Modelled here as a pure function of the final selected price.
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
