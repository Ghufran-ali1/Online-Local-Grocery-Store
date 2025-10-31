import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ProductContext } from "../context/ProductContext";
import { CircularProgress, IconButton } from "@mui/material";
import ProductPicks from "../components/ProductPicks";
import CallToAction from "../components/CallToAction";
import AppBreadcrumbs from "../components/Breadcrumbs";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "var(--background-color)",
  boxShadow: 0,
  borderRadius: 4,
  p: 3,
};

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
  const [open, setOpen] = useState({ state: false, store_no: null });
  const [newReservation, setNewReservation] = useState({
    reserved_by: "User Name",
    email: "testuser@example.com",
    date: new Date().toISOString().split("T")[0],
    quantity: 5,
  });

  useEffect(() => {
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
  }, []);

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

  const handleAddReservation = (rsv_no) => {
    const stored = localStorage.getItem("reservations");
    const current = stored ? JSON.parse(stored) : [];
    const updated = [...current, rsv_no];

    localStorage.setItem("reservations", JSON.stringify(updated));
    window.dispatchEvent(new Event("reservations-updated"));
  };

  useEffect(() => {
    if (productDetails) {
      fetch(`https://grocery-store-server-theta.vercel.app/api/update-item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productDetails?.id,
          name: productDetails?.name,
          category: productDetails?.category,
          description: productDetails?.description,
          quantity: productDetails?.quantity,
          gallery: productDetails?.gallery,
          views: (parseInt(productDetails?.views) || 0) + 1,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log('new views: ' + data.views);
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  }, [productDetails]);

  const handleReservation = (store_no) => {
    document.getElementById("reserveBtn").disabled = true;
    document.getElementById("reserveBtn").innerText = "Reserving ...";

    fetch(`https://grocery-store-server-theta.vercel.app/api/reserve-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newReservation,
        store_no: store_no,
        name: productDetails?.name,
        category: productDetails?.category,
      }),
    })
      .then((res) => res.json())
      .then((reservationData) => {
        if (reservationData.error) throw new Error(reservationData.error);

        fetch(`https://grocery-store-server-theta.vercel.app/api/update-item`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: productDetails?.id,
            name: productDetails?.name,
            category: productDetails?.category,
            description: productDetails?.description,
            quantity:
              parseInt(productDetails?.quantity) - newReservation.quantity,
            gallery: productDetails?.gallery,
            views: productDetails?.views,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            const reservationRecord =
              data.store_no + "-" + reservationData.data.rsv_no;
            console.log("reservation data", reservationRecord);
            handleAddReservation(reservationData.data.rsv_no);
            setProductDetails({
              ...productDetails,
              quantity:
                parseInt(productDetails?.quantity) - newReservation.quantity,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        setTimeout(() => {
          setOpen({ state: false, store_no: null });
          document.getElementById("reserveBtn").disabled = false;
          document.getElementById("reserveBtn").innerText = "Make Reservation";
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        document.getElementById("reserveBtn").disabled = false;
        document.getElementById("reserveBtn").innerText = "Make Reservation";
      });
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
      <AppBreadcrumbs />

      {productDetails?.name ? (
        <ProductContext.Provider value={productDetails}>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open.state}
            onClose={() => setOpen({ state: false, store_no: null })}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open.state}>
              <Box sx={style}>
                <h4
                  className="fw-bold"
                  style={{ color: "var(--primary-color)" }}
                >
                  Reserve Item
                </h4>
                <p>
                  To reserve this item, please enter your contact details and
                  preferred reservation date.
                </p>
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReservation(productDetails?.store_no);
                    }}
                  >
                    <div className="mb-3">
                      <label
                        htmlFor="reserved_by"
                        className="form-label fw-bold"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control border-0"
                        required
                        id="reserved_by"
                        value={newReservation.reserved_by}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            reserved_by: e.target.value,
                          })
                        }
                        // placeholder="Enter your full name"
                        style={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--text-color)",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control border-0"
                        id="email"
                        required
                        value={newReservation.email}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            email: e.target.value,
                          })
                        }
                        // placeholder="Enter your email address"
                        style={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--text-color)",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label fw-bold">
                        Reservation Date
                      </label>
                      <input
                        type="date"
                        className="form-control border-0"
                        id="date"
                        required
                        value={newReservation.date}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            date: e.target.value,
                          })
                        }
                        // placeholder="Select reservation date"
                        style={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--text-color)",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label fw-bold">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control border-0"
                        id="quantity"
                        required
                        min={1}
                        max={parseInt(productDetails?.quantity)}
                        value={newReservation.quantity}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            quantity: e.target.value,
                          })
                        }
                        // placeholder="Enter quantity"
                        style={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--text-color)",
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        id="reserveBtn"
                        type="submit"
                        className="p-1 px-4 me-3 border border-primary outline-0 text-white rounded-3 small"
                        style={{
                          border: "1px solid var(--primary-color)",
                          backgroundColor: "var(--primary-color)",
                        }}
                      >
                        Make Reservation
                      </button>
                      <button
                        className="p-1 px-4 border-0 outline-0 bg-dark text-light rounded-3 small"
                        onClick={() =>
                          setOpen({ state: false, store_no: null })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Box>
            </Fade>
          </Modal>

          <div className="container m-auto d-flex gap-4 rounded-3 p-2 mb-3 flex-column flex-md-row" style={{border: "1px solid var(--text-light)"}}>
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
                  {/* <div
                    role="button"
                    className="px-1 d-flex justify-content-end align-items-center gap-2"
                    style={{
                      color:
                        reservationsIdentifiers?.includes(
                          productDetails?.store_no
                        ) && "red",
                    }}
                    onClick={() => handleAddReservation(productDetails?.store_no)}
                  >
                    <i
                      className={
                        reservationsIdentifiers.includes(productDetails?.store_no)
                          ? "bi bi-heart-fill fs-5"
                          : "bi bi-heart fs-5"
                      }
                    ></i>{" "}
                    <span>Favorite</span>
                  </div> */}
                </div>
                <h1 className="fw-semibold mb-3">{productDetails?.name}</h1>
                <div
                  className="mb-5 p-2"
                  style={{
                    backgroundColor: "var(--background-light)",
                    border: "1px solid var(--text-light)",
                  }}
                >
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
                    <i className="bi bi-eye"></i> &nbsp; {productDetails?.views}{" "}
                    views
                  </button>
                  {productDetails?.stock && (
                    <button
                      className="small p-1 px-4 mr-2 border-0 outline-0 rounded-3"
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      <i className="bi bi-cart"></i> &nbsp; In stock
                    </button>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <input
                  style={{ width: "70px" }}
                  max={productDetails?.quantity}
                  value={newReservation.quantity}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      quantity: e.target.value,
                    })
                  }
                  className="p-2 text-center rounded-2 border-1 outline-0"
                  type="number"
                />
                <button
                  className="w-100 text-light p-2 rounded-2"
                  style={{
                    border: "1px solid var(--primary-color)",
                    backgroundColor: "var(--primary-color)",
                  }}
                  onClick={() =>
                    setOpen({ state: true, store_no: productDetails?.store_no })
                  } // Replace with actual reservation handler
                >
                  Make Reservation
                </button>
              </div>
              <small className="text-secondary">
                Free delivery on orders over $150. Contact us on{" "}
                <a href="tel:+1234567890">+1 (999) 234-567890</a> for more
                information.
              </small>
            </div>
          </div>
          {productDetails?.category && (
            <>
              <h4 className="container mt-5 fw-bold">
                Similar Items from {productDetails.category}
              </h4>
              <ProductPicks items={items} Similar={productDetails.category} />
            </>
          )}
        </ProductContext.Provider>
      ) : (
        <div className="container m-auto py-5 mt-3 mb-3 d-flex justify-content-center mt-3 mb-4 flex-column align-items-center">
          <CircularProgress size={30} />
          <span className="mt-3">Loading product details...</span>
        </div>
      )}
      <CallToAction />
    </>
  );
}

export default Product;
