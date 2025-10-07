import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Avatar, Modal } from "@mui/material";


function AdminView({ admins }) {
  const containerRef = useRef();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);


  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < maxScrollLeft - 5); // `-5` for precision
  };

  // Recheck on manual scroll or resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll(); // Initial check

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

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
        className="position-relative mt-2 mb-3 d-flex gap-4 overflow-auto justify-content-center"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          scrollBehavior: "smooth",
        }}
      >
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="Item"
            style={{
              scrollSnapAlign: "start",
              minWidth: "200px",
              flexShrink: 0,
            }}
          >
            <Avatar className="mb-2 m-auto" alt={admin.name} src={admin.avatar} style={{ width: "100px", height: "100px" }} />
            <div className="text-center fw-semibold fs-6">{admin.username}</div>
            <div className="text-center">{admin.email}</div>
            <div className="text-center small text-muted">
              <Link to={`#`}>View Details</Link>
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

export default AdminView;
