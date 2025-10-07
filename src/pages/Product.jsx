import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ProductContext } from "../ProductContext";
import { CircularProgress, IconButton } from "@mui/material";
import ProductPicks from "../components/ProductPicks";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AppBreadcrumbs from "../components/Breadcrumbs";
import CallToAction from "../components/CallToAction";

function Product() {
  const { itemStockNo } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const stored = localStorage.getItem("watchlist");
  const currentWatchList = stored ? JSON.parse(stored) : [];
  const [watchlistIdentifiers, setWatchlistIdentifiers] =
    useState(currentWatchList);

  const storedFav = localStorage.getItem("favorites");
  const currentFavs = storedFav ? JSON.parse(storedFav) : [];
  const [favoritesIdentifiers, setFavoritesIdentifiers] = useState(currentFavs);



  useEffect(() => {
    // Fetch all items for simmilar items section
    fetch(`https://grocery-store-server-theta.vercel.app/api/items`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        // 
      });
  }, [])
  


  // Fetch product details
  useEffect(() => {
    if (!itemStockNo) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(
      `https://grocery-store-server-theta.vercel.app/api/items/${itemStockNo}`,
      {
        signal: controller.signal,
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProductDetails(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [itemStockNo]);

  const handleAddWatchlist = (store_no) => {
    const stored = localStorage.getItem("watchlist");
    const current = stored ? JSON.parse(stored) : [];
    const updated = current.includes(store_no)
      ? current.filter((no) => no !== store_no)
      : [...current, store_no];

    setWatchlistIdentifiers(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlist-updated"));
  };

  const handleAddFavorite = (store_no) => {
    const stored = localStorage.getItem("favorites");
    const current = stored ? JSON.parse(stored) : [];
    const updated = current.includes(store_no)
      ? current.filter((no) => no !== store_no)
      : [...current, store_no];

    setFavoritesIdentifiers(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  // Conditional renders
  if (loading)
    return (
      <div className="container m-auto py-4 d-flex justify-content-center mt-3 mb-4">
        <CircularProgress size={30} />
      </div>
    );

  if (error)
    return (
      <div className="container m-auto py-4 d-flex justify-content-center">
        Error loading product.
      </div>
    );
    
  return (
    <>
      <Header />
      <AppBreadcrumbs />
      {productDetails?.name ? (
        <ProductContext.Provider value={productDetails}>
          <div className="container m-auto d-flex gap-4 border rounded-3 p-2 mb-3 flex-column flex-md-row">
            <div className="w-100 p-2">
              <img
                className="img-fluid w-100 p-2"
                src={productDetails?.gallery[currentIndex]}
                alt={""}
                style={{
                  minWidth: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="d-flex gap-2 mt-2 overflow-auto justify-content-center align-items-center">
                {productDetails?.gallery.map((img, index) => (
                  <img
                    role="button"
                    onClick={() => setCurrentIndex(index)}
                    key={index}
                    className="img-fluid p-1"
                    src={img}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      objectPosition: "center",
                      marginRight: "8px",
                      border:
                        currentIndex === index
                          ? "1px solid var(--primary-color)"
                          : "1px solid gainsboro",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="p-2 px-3 w-100 d-flex flex-column justify-content-start gap-4">
              <div>
                <div className="d-flex justify-content-end align-items-center gap-3">
                  <div
                    role="button"
                    className="px-1 d-flex justify-content-end align-items-center gap-2"
                    style={{
                      color:
                        watchlistIdentifiers?.includes(
                          productDetails?.store_no
                        ) && "var(--primary-color)",
                    }}
                    onClick={() => handleAddWatchlist(productDetails?.store_no)}
                  >
                    <i
                      className={
                        watchlistIdentifiers.includes(productDetails?.store_no)
                          ? "bi bi-eye-fill fs-5"
                          : "bi bi-eye fs-5"
                      }
                    ></i>{" "}
                    <span className="small">Watchlist</span>
                  </div>
                  <div
                    role="button"
                    className="px-1 d-flex justify-content-end align-items-center gap-2"
                    style={{
                      color:
                        favoritesIdentifiers?.includes(
                          productDetails?.store_no
                        ) && "red",
                    }}
                    onClick={() => handleAddFavorite(productDetails?.store_no)}
                  >
                    <i
                      className={
                        favoritesIdentifiers.includes(productDetails?.store_no)
                          ? "bi bi-heart-fill fs-5"
                          : "bi bi-heart fs-5"
                      }
                    ></i>{" "}
                    <span>Favorite</span>
                  </div>
                </div>
                <h1 className="fw-semibold mb-3">{productDetails?.name}</h1>
                <div className="mb-5 p-2 border bg-light">
                  <div className="small mb-2">
                    <strong>Description: </strong>
                  </div>
                  <div style={{ color: "var(--text-light)" }}>
                    {productDetails?.description}
                  </div>
                </div>
                <small
                  className={
                    productDetails?.quantity > 10
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {productDetails?.quantity > 10 ? (
                    <span className="d-flex gap-2 align-items-center">
                      <i className="bi bi-info-circle"></i>{" "}
                      {productDetails?.quantity} Remaining
                    </span>
                  ) : (
                    <span className="d-flex gap-2 align-items-center">
                      <i className="bi bi-info-circle"></i> Only{" "}
                      {productDetails?.quantity} Remaining.
                    </span>
                  )}
                </small>
                <div className="d-flex gap-2 mt-1">
                  <button
                    className="small p-1 px-4 border-0 outline-0 rounded-3"
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {productDetails?.views} views
                  </button>
                  {productDetails?.stock && (
                    <button
                      className="small p-1 px-4 mr-2 border-0 outline-0 rounded-3"
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      In stock
                    </button>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <input
                  style={{ width: "70px" }}
                  max={productDetails?.quantity}
                  defaultValue={10}
                  className="p-2 text-center rounded-2 border-1 outline-0"
                  type="number"
                  step={5}
                />
                <button
                  className="w-100 text-light p-2 rounded-2"
                  style={{
                    border: "1px solid var(--primary-color)",
                    backgroundColor: "var(--primary-color)",
                  }}
                >
                  Make Reservation
                </button>
              </div>
              <small className="text-secondary">
                Free delivery on orders over $150. Contact us on <a href="tel:+1234567890">+1 (999) 234-567890</a> for more information.
              </small>
            </div>
          </div>
          <h4 className="container mt-5 fw-bold">Similar Items</h4>
          {productDetails?.category && (
            <ProductPicks items={items} Simmilar={productDetails.category} />
          )}
        </ProductContext.Provider>
      ) : (
        <div className="container m-auto py-5 mt-3 mb-3 d-flex justify-content-center mt-3 mb-4 flex-column align-items-center">
          <CircularProgress size={30} />
          <span className="mt-3">Loading product details...</span>
        </div>
      )}
      <CallToAction />
      <Footer />
    </>
  );
}

export default Product;
