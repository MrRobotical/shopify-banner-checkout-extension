import React, { useEffect, useState } from "react";
import {
  reactExtension,
  Banner,
  useSettings,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => (
  <App />
));
export { checkoutBlock };

const deliveryAddress = reactExtension(
  "purchase.checkout.delivery-address.render-before",
  () => <App />,
);
export { deliveryAddress };

function App() {
  const {
    title: merchantTitle,
    description,
    collapsible,
    status: merchantStatus,
  } = useSettings();
  const cartLines = useCartLines();
  const [hasFragileProduct, setHasFragileProduct] = useState(false);

  useEffect(() => {
    const checkForFragileProducts = () => {
      const fragileProducts = cartLines.some(
        (line) => line.merchandise.product.productType === "fragile",
      );

      setHasFragileProduct(fragileProducts);
    };

    checkForFragileProducts();
  }, [cartLines]);

  if (!hasFragileProduct) {
    return null; // Don't render anything if no fragile product is found
  }

  const status = merchantStatus ?? "info";
  const title = merchantTitle ?? "Custom Banner";

  return (
    <Banner title={title} status={status} collapsible={collapsible}>
      {description}
    </Banner>
  );
}
