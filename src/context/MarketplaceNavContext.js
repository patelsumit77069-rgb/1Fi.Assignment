import { createContext } from "react";

// Holds the navigation callbacks for the Marketplace tab's own mini stack
// (list -> detail -> plans -> confirm) so deeply nested screens don't need
// props threaded through every intermediate component.
export const MarketplaceNavContext = createContext(null);
