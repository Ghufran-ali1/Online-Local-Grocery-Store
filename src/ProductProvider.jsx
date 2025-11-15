import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "./context/ProductContext";

export default function ProductProvider({ children }) {
  const { itemStockNo } = useParams();
  const [data, setData] = React.useState(null);

  useEffect(() => {
    if (itemStockNo) {
      fetch(
        `https://grocery-store-server-theta.vercel.app/api/items/${itemStockNo}`
      )
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => setData(null));
    }
  }, [itemStockNo]);

  // while loading, value is null, then switches to the product name string
  return (
    <ProductContext.Provider value={data ? data.name : null}>
      {children}
    </ProductContext.Provider>
  );
}
