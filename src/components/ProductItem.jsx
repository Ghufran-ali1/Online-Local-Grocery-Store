import { Link } from "react-router-dom";
import { useState } from "react";
import { IconButton } from "@mui/material";

function ProductItem({ ProductDetails = null, display = "grid" }) {
  const stored = localStorage.getItem("watchlist");
  const currentWatchList = stored ? JSON.parse(stored) : [];
  const [allWatchList, setAllWatchlist] = useState(currentWatchList);

  const storedReservations = localStorage.getItem("reservations");
  const currentReservations = storedReservations
    ? JSON.parse(storedReservations)
    : [];
  const [allReservations, setAllReservations] = useState(currentReservations);

  const handleAddWatchlist = (store_no) => {
    const stored = localStorage.getItem("watchlist");
    const current = stored ? JSON.parse(stored) : [];

    let updated;
    if (!current.includes(store_no)) {
      updated = [...current, store_no];
    } else {
      updated = current.filter((no) => no !== store_no);
    }

    setAllWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));

    window.dispatchEvent(new Event("watchlist-updated"));
  };


  if (!ProductDetails) {
    return;
  }

  return (
    <Link
      key={ProductDetails?.id}
      onClick={() => window.scrollTo(0, 0)}
      to={`/store/${ProductDetails?.category}/${ProductDetails?.store_no}`}
      style={{ zIndex: 1, lineHeight: 1.5 }}
      className="text-decoration-none position-relative mb-3 w-100"
    >
      <div
        className="d-flex gap-2 position-absolute"
        style={{ top: "8px", right: "8px", zIndex: 10 }}
      >
        {ProductDetails?.stock && (
          <button
            className="small p-1 px-2 border-0 outline-0 rounded-2"
            style={{ backgroundColor: "green", color: "white" }}
          >
            In stock
          </button>
        )}
        {/* {New && <button className='small p-1 px-2 border-0 outline-0 rounded-2' style={{ backgroundColor: '#FF8C00', color: 'white' }}>New 🔥</button>} */}
      </div>
      <div
        className={`text-decoration-none bg-light item w-100 d-flex p-2 pt-3 pb-1 ${
          display === "grid" ? "flex-column" : "flex-row"
        }  justify-content-start align-items-start border productItem`}
        style={{
          aspectRatio: display === "grid" && "1/1",
          scrollSnapType: "x mandatory",
          scrollSnapStop: "always",
          borderRadius: "8px",
          scrollSnapAlign: "start",
        }}
      >
        <img
          src={`${ProductDetails?.gallery[0]}`}
          alt={""}
          width={display === "grid" ? "100%" : "200px"}
          className="mb-2 object-fit-cover object-position-center p-2"
          style={{
            aspectRatio: "1/.91",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className="w-100">
          <div className="px-1 m-0 w-100">
            <div className="fw-semibold m-0 p-0 fs-6 singleLineClamp">
              {ProductDetails?.name}
            </div>
            <small className="singleLineClamp" style={{ color: "var(--text-light)" }}>
              {ProductDetails?.quantity} Remaining | {ProductDetails?.description}
            </small>

            {/* <div className='small mt-2'><strong>Description: </strong></div>
                  <small style={{ color: 'var(--text-light)' }}>{ProductDetails?.description}</small> */}
          </div>
          <div
            className="d-flex p-0 small gap-1 justify-content-end w-100"
            style={{ zIndex: 10 }}
          >
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleAddWatchlist(ProductDetails?.store_no);
              }}
              title="Add to Watchlist"
            >
              <i
                className={`bi ${
                  allWatchList.includes(ProductDetails?.store_no)
                    ? "bi-eye-fill"
                    : "bi-eye"
                } small`}
                style={{
                  lineHeight: "0",
                  color: allWatchList.includes(ProductDetails?.store_no)
                    ? "var(--primary-color)"
                    : "",
                }}
              ></i>
            </IconButton>
            {/* <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleAddFavorite(ProductDetails?.store_no);
              }}
            >
              <i
                className={`bi ${
                  allReservations.includes(ProductDetails?.store_no)
                    ? "bi-heart-fill"
                    : "bi-heart"
                } small`}
                style={{
                  lineHeight: "0",
                  color: allReservations.includes(ProductDetails?.store_no)
                    ? "red"
                    : "",
                }}
              ></i>
            </IconButton> */}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductItem;
