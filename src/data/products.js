// Stand-in for a product/EMI catalog service. In production this file
// disappears and marketplaceApi.js calls real endpoints instead - nothing
// in components or screens references PRODUCTS_DB directly.
export const PRODUCTS_DB = [
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
    name: '55" QNED TV',
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
          { id: "50in", label: '50"', priceDelta: -8000 },
          { id: "55in", label: '55"', priceDelta: 0 },
          { id: "65in", label: '65"', priceDelta: 25000 },
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
