import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function ProductPicks({
  items,
  loading,
  Trending = false,
  Top = false,
  New = false,
  Fresh = false,
  Simmilar = null,
}) {
  const containerRef = useRef();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [PickedItems, setPickedItems] = useState([]);

  const stored = localStorage.getItem("watchlist");
  const currentWatchList = stored ? JSON.parse(stored) : [];
  const [allWatchList, setAllWatchlist] = useState(currentWatchList);

  const storedFav = localStorage.getItem("favorites");
  const currentFavs = storedFav ? JSON.parse(storedFav) : [];
  const [allFavorites, setAllFavorites] = useState(currentFavs);

  useEffect(() => {
    if (items) {
      const trendingItems = [...items]
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const newItems = [...items]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      const freshItems = [...items]
        .filter(
          (item) => item.category === "Fruits" || item.category === "Vegetables"
        )
        .slice(0, 10);

      const simmilarItems = [...items]
        .filter((item) => item.category === Simmilar)
        .slice(0, 10);

      if (Trending) setPickedItems(trendingItems);
      if (New) setPickedItems(newItems);
      if (Fresh) setPickedItems(freshItems);
      if (Top) setPickedItems([...items].slice(0, 10));
      if (Simmilar) setPickedItems(simmilarItems);
    }
  }, [items]);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < maxScrollLeft - 5); // `-5` for precision
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => checkScroll();
    const handleResize = () => checkScroll();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // 🔑 Initial check after next paint
    requestAnimationFrame(checkScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [PickedItems]);

  // Function to scroll the container
  const scroll = (direction) => {
    const container = containerRef.current;
    const itemWidth = container.offsetWidth;

    // Scroll the container by one item width
    container.scrollBy({ left: direction * itemWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const firstItem = container.querySelector(".Item");
    if (!firstItem) return;

    let itemWidth =
      firstItem.offsetWidth +
      parseFloat(getComputedStyle(firstItem).marginRight || 0);
    let currentIndex = 0;

    const scrollOneItem = () => {
      if (!container) return;

      const maxIndex =
        Math.floor(container.scrollWidth / itemWidth) -
        Math.floor(container.offsetWidth / itemWidth);

      if (currentIndex >= maxIndex) {
        currentIndex = 0;
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        currentIndex++;
        container.scrollTo({
          left: currentIndex * itemWidth,
          behavior: "smooth",
        });
      }
    };

    const intervalId = setInterval(scrollOneItem, 5000);

    // Optional: Listen to window resize to remeasure item width
    const handleResize = () => {
      const newFirstItem = container.querySelector(".Item");
      if (newFirstItem) {
        itemWidth =
          newFirstItem.offsetWidth +
          parseFloat(getComputedStyle(newFirstItem).marginRight || 0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleAddFavorite = (store_no) => {
    const stored = localStorage.getItem("favorites");
    const current = stored ? JSON.parse(stored) : [];

    let updated;
    if (!current.includes(store_no)) {
      updated = [...current, store_no];
    } else {
      updated = current.filter((no) => no !== store_no);
    }

    setAllFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <div className="position-relative p-2 py-3 mb-2 mt-2 container">
      {canScrollPrev && (
        <button
          className="carousel-nav shadow carousel-prev"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft />
        </button>
      )}
      <div
        ref={containerRef}
        className="position-relative mt-2 mb-3 d-flex gap-4 overflow-auto"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          scrollBehavior: "smooth",
        }}
      >
        {!loading
          ? PickedItems.map((item, index) => (
              <Link
                onClick={() => window.scrollTo(0, 0)}
                to={`/store/${item.category}/${item.store_no}`}
                key={index}
                style={{ zIndex: 1, lineHeight: 1.5 }}
                className="text-decoration-none position-relative"
              >
                <div
                  className="d-flex gap-2 position-absolute"
                  style={{ top: "8px", right: "8px", zIndex: 10 }}
                >
                  {item.stock && (
                    <button
                      className="small p-1 px-2 border-0 outline-0 rounded-2"
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      In stock
                    </button>
                  )}
                  {New && (
                    <button
                      className="small p-1 px-2 border-0 outline-0 rounded-2"
                      style={{ backgroundColor: "#FF8C00", color: "white" }}
                    >
                      New 🔥
                    </button>
                  )}
                </div>
                <div
                  className="text-decoration-none item d-flex p-2 pt-3 pb-1 flex-column justify-content-start align-items-start border productItem"
                  style={{
                    width: "250px",
                    aspectRatio: "1/1",
                    scrollSnapType: "x mandatory",
                    scrollSnapStop: "always",
                    borderRadius: "8px",
                    scrollSnapAlign: "start",
                  }}
                >
                  <img
                    src={`${item.gallery[0]}`}
                    width={"100%"}
                    className="mb-2 object-fit-cover object-position-center p-2"
                    style={{
                      aspectRatio: "1/.9",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <div className="px-1 m-0 w-100">
                    <div className="fw-semibold m-0 p-0">{item.name}</div>
                    <small
                      className="doubleLineClamp mt-1"
                      style={{ color: "var(--text-light)" }}
                    >
                      {item.description}
                    </small>
                  </div>
                  <div
                    className="d-flex p-0 small gap-1 justify-content-end w-100"
                    style={{ zIndex: 10 }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        handleAddWatchlist(item.store_no);
                      }}
                    >
                      <i
                        className={`bi ${
                          allWatchList.includes(item?.store_no)
                            ? "bi-eye-fill"
                            : "bi-eye"
                        } small`}
                        style={{
                          lineHeight: "0",
                          color: allWatchList.includes(item?.store_no)
                            ? "var(--primary-color)"
                            : "",
                        }}
                      ></i>
                    </IconButton>
                    {/* <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        handleAddFavorite(item.store_no);
                      }}
                    >
                      <i
                        className={`bi ${
                          allFavorites.includes(item?.store_no)
                            ? "bi-heart-fill"
                            : "bi-heart"
                        } small`}
                        style={{
                          lineHeight: "0",
                          color: allFavorites.includes(item?.store_no)
                            ? "red"
                            : "",
                        }}
                      ></i>
                    </IconButton> */}
                  </div>
                </div>
              </Link>
            ))
          : [...Array(9)].map((_, index) => (
              <div
              key={index}
                style={{ zIndex: 1, lineHeight: 1.5 }}
                className="text-decoration-none placeholder-glow position-relative"
              >
                {/* top right badges */}
                <div
                  className="d-flex gap-2 position-absolute"
                  style={{ top: "8px", right: "8px", zIndex: 10 }}
                >
                  <div
                    className="small placeholder col-2 p-1 px-2 border-0 outline-0 rounded-2"
                    style={{
                      width: "60px",
                      height: "20px",
                    }}
                  />
                  {New && (
                    <div
                      className="small placeholder col-2 p-1 px-2 border-0 outline-0 rounded-2"
                      style={{
                        width: "65px",
                        height: "20px",
                      }}
                    />
                  )}
                </div>

                {/* card container */}
                <div
                  className="text-decoration-none item d-flex p-2 pt-3 pb-1 flex-column justify-content-start align-items-start border productItem"
                  style={{
                    width: "250px",
                    aspectRatio: "1/1",
                    scrollSnapType: "x mandatory",
                    scrollSnapStop: "always",
                    borderRadius: "8px",
                    scrollSnapAlign: "start",
                  }}
                >
                  {/* image placeholder */}
                  <div
                    className="placeholder rounded mb-3 w-100"
                    style={{
                      aspectRatio: "3/2.5",
                      backgroundColor: "rgba(0,0,0,0.08)",
                    }}
                  ></div>

                  {/* text placeholders */}
                  <div className="px-1 m-0 w-100">
                    <div
                      className="placeholder col-8 mb-2"
                      style={{ height: "16px", borderRadius: "4px" }}
                    ></div>
                    <div
                      className="placeholder col-12 mb-1"
                      style={{ height: "12px", borderRadius: "4px" }}
                    ></div>
                    <div
                      className="placeholder col-6"
                      style={{ height: "12px", borderRadius: "4px" }}
                    ></div>
                  </div>

                  {/* icon placeholders */}
                  <div
                    className="d-flex p-0 small gap-1 justify-content-end w-100 mt-auto"
                    style={{ zIndex: 10 }}
                  >
                    <div
                      className="placeholder rounded-circle"
                      style={{ width: "24px", height: "24px" }}
                    ></div>
                    <div
                      className="placeholder rounded-circle"
                      style={{ width: "24px", height: "24px" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {canScrollNext && (
        <button
          className="carousel-nav shadow carousel-next"
          onClick={() => scroll(1)}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}

export default ProductPicks;
