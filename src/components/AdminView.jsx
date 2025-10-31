import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Avatar, Modal } from "@mui/material";

function AdminView({ admins }) {
  const containerRef = useRef();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeAdmin, setActiveAdmin] = useState(null);

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    const listener = () => {
      // invert theme to get the new current value
      setTheme(localStorage.getItem("theme") === "light" ? "dark" : "light");
    };
    window.addEventListener("themeChanged", listener);
    return () => window.removeEventListener("themeChanged", listener);
  }, []);

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
    <>
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
          {admins.map((admin, index) => (
            <div
              key={admin.id || index}
              className="Item"
              style={{
                scrollSnapAlign: "start",
                minWidth: "200px",
                flexShrink: 0,
              }}
            >
              <Avatar
                className="mb-2 m-auto"
                alt={admin.name}
                src={admin.avatar}
                style={{ width: "100px", height: "100px" }}
              />
              <div className="text-center fw-semibold fs-6">
                {index + 1}. {admin.username}
              </div>
              <div className="text-center">{admin.email}</div>
              <div className="text-center small text-muted">
                <Link to={`#`} onClick={() => setActiveAdmin(admin)}>
                  View Details
                </Link>
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

      {activeAdmin && (
        <div
          className="position-absolute bg-secondary top-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
          style={{ zIndex: 2 }}
        >
          <div
            className="position-relative w-100 rounded-3 mb-3 shadow p-2 d-flex align-items-center flex-column flex-md-row gap-3"
            style={{ border: "1px solid var(--text-light)", backgroundColor: "var(--background-color)", zIndex: 2 }}
          >
            <div
              className="position-absolute border-0 p-2 px-3 bg-transparent d-flex gap-2"
              style={{
                top: "0px",
                right: "10px",
              }}
            >
              <button
                className=" border-0 p-2 px-3 bg-transparent d-flex gap-2"
                onClick={() => {
                  // setOpenEdit({
                  //   state: true,
                  //   store_no: item.store_no,
                  // });
                  // setEditItemDetails(item);
                  // setEditItemOriginalDetails(item);
                }}
                title="Edit"
                style={{
                  color: "var(--primary-color)",
                }}
              >
                Edit <i className="bi bi-pencil-square"></i>
              </button>
              <button
                className=" border-0 p-2 px-3 bg-transparent d-flex gap-2"
                onClick={() =>
                  // setOpen({ state: true, store_no: item.store_no })
                  true
                }
                title="Edit"
                style={{
                  color: "red",
                }}
              >
                Delete <i className="bi bi-trash"></i>
              </button>
              <button
                className=" border-0 p-2 bg-transparent d-flex gap-2"
                onClick={() =>
                  setActiveAdmin(null)
                }
                title="Close"
                style={{
                  color: "red",
                }}
              >
                Close <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-2">
              <Avatar
                className="object-fit-cover object-position-center p-2"
                sx={{ width: 200, height: 200 }}
                src={activeAdmin?.avatar}
                alt={activeAdmin?.username}
              />
            </div>
            <div className="w-100 p-1 mt-2">
              <table
                className={`table  adminStoreItemDetails table-sm ${
                  theme === "dark" ? "table-dark" : ""
                }`}
              >
                <tbody>
                  <tr>
                    <th
                      className="px-3"
                      scope="row"
                      style={{ textAlign: "right", width: "20%" }}
                    >
                      ID
                    </th>
                    <td>{activeAdmin.id}</td>
                  </tr>
                  <tr>
                    <th
                      className="px-3"
                      scope="row"
                      style={{ textAlign: "right" }}
                    >
                      Name
                    </th>
                    <td>{activeAdmin.username}</td>
                  </tr>
                  <tr>
                    <th
                      className="px-3"
                      scope="row"
                      style={{ textAlign: "right" }}
                    >
                      Email
                    </th>
                    <td>{activeAdmin.email}</td>
                  </tr>
                  <tr>
                    <th
                      className="px-3"
                      scope="row"
                      style={{ textAlign: "right" }}
                    >
                      Role
                    </th>
                    <td>{activeAdmin.role}</td>
                  </tr>
                  <tr>
                    <th
                      className="px-3"
                      scope="row"
                      style={{ textAlign: "right" }}
                    >
                      Created By
                    </th>
                    <td>
                      {admins.find((a) => a.id === activeAdmin.created_by)
                        ?.username || "Not defined!"}
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="px-3"
                      scope="row"
                      style={{ textAlign: "right" }}
                    >
                      Date Created
                    </th>
                    <td>{activeAdmin.created_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminView;
