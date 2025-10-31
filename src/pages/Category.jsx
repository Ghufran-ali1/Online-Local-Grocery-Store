import CategoriesTab from "../components/CategoriesTab";
import { Link, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import CatehgoriesTab from "../components/CategoriesTab";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TablePagination,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ProductItem from "../components/ProductItem";
import AppBreadcrumbs from "../components/Breadcrumbs";
import CallToAction from "../components/CallToAction";
import NewItemCreateCTA from "../components/NewItemCreateCTA";

function Category() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Default Order");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [columnCount, setColumnCount] = useState(4);
  const [allCategories, setAllCategories] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    try {
      fetch("https://grocery-store-server-theta.vercel.app/api/items")
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (items) {
      const categories = items
        ?.map((item) => item.category)
        .reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

      setAllCategories(Object.keys(categories));
    }
  }, [items]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (deal) => {
    setSelectedDeals(
      (prev) =>
        prev.includes(deal)
          ? prev.filter((d) => d !== deal) // remove if already selected
          : [...prev, deal] // add if not selected
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 568) {
        setColumnCount(2);
      } else if (window.innerWidth < 1200) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    handleResize(); // set on first render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!items) return;

    const filteredItems =
      category === "All Categories"
        ? items
        : items.filter((item) => item.category === category);

    setAllResults(filteredItems);
  }, [items, category]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort and slice items for current page
  const sortedItems = React.useMemo(() => {
    return allResults?.slice().sort((a, b) => a.id - b.id) || [];
  }, [allResults]);

  const pagedItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  return (
    <>
      <AppBreadcrumbs />
      <div className="container m-auto min-vh-100">
        <CategoriesTab items={items} activeTab={category} />
        <NewItemCreateCTA />

        <div className="d-flex gap-2 flex-column flex-md-row align-items-start">
          <div
            className="p-3 col-12 col-md-3 rounded-3 position-md-sticky top-0"
            style={{ backgroundColor: "var(--background-light)" }}
          >
            <h4 className="fw-bold">Deals</h4>
            <FormGroup className="px-3">
              {["In Stock", "Today's Deals", "New Arrivals", "Top Selling"].map(
                (item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        checked={selectedDeals.includes(item)}
                        onChange={() => handleToggle(item)}
                      />
                    }
                    label={item}
                  />
                )
              )}
            </FormGroup>
            <h4 className="fw-bold mt-4">Categories</h4>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <FormGroup className="px-3">
                {["All Categories", ...allCategories]?.map((item) => (
                  <Link key={item} to={`/store/${item}`}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={category === item}
                          onChange={() => handleToggle(item)}
                        />
                      }
                      label={item}
                    />
                  </Link>
                ))}
              </FormGroup>
            </div>
          </div>
          <div
            className="p-3 col-12 col-md-9 rounded-3"
            style={{
              backgroundColor: "var(--background-light)",
              minHeight: "50vh",
            }}
          >
            <div className="d-flex justify-content-between mt-1 mb-2 align-items-center">
              <h3 className="fw-bold">{category}</h3>
              <div className="d-flex gap-2 align-items-center">
                <GridViewIcon
                  role="button"
                  onClick={() => setView("grid")}
                  style={{ color: view === "grid" && "var(--primary-color)" }}
                  className="p-1"
                  fontSize="medium"
                />
                <ViewListIcon
                  role="button"
                  onClick={() => setView("list")}
                  style={{ color: view === "list" && "var(--primary-color)" }}
                  fontSize="medium"
                />

                <span
                  className="p-1 px-3 small"
                  role="button"
                  onClick={handleClick}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  style={{
                    border:
                      sortBy === "Default Order"
                        ? "1px solid transparent"
                        : "1px solid var(--primary-color)",
                  }}
                >
                  Sort by &nbsp;
                  <SwapVertIcon fontSize="small" />
                </span>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {[
                    "Default Order",
                    "Date Added",
                    "Stock Sie",
                    "Alphabetical Order (A - Z)",
                    "Alphabetical Order (Z - A)",
                  ].map((sort) => (
                    <MenuItem
                      className="small mb-2"
                      selected={sortBy === sort}
                      key={sort}
                      onClick={() => {
                        setSortBy(sort);
                        handleClose();
                      }}
                    >
                      {sort}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>

            <div className="text-center py-4 text-muted mb-3">
              {allResults?.length || 0} items found in {category}
            </div>

            {allResults?.length > 0 ? (
              <div
                className="d-grid gap-3 justify-content-start"
                style={{
                  gridTemplateColumns:
                    view === "grid" ? `repeat(${columnCount}, 1fr)` : "1fr",
                }}
              >
                {pagedItems?.map((item) => (
                  <ProductItem
                    display={view}
                    key={item.id}
                    ProductDetails={item}
                  />
                ))}
              </div>
            ) : (
              <div
                className="d-grid gap-3 justify-content-start"
                style={{
                  gridTemplateColumns:
                    view === "grid" ? `repeat(${columnCount}, 1fr)` : "1fr",
                }}
              >
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    style={{ zIndex: 1, lineHeight: 1.5 }}
                    className="text-decoration-none placeholder-glow position-relative mb-3"
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
                      <div
                        className="small placeholder col-2 p-1 px-2 border-0 outline-0 rounded-2"
                        style={{
                          width: "65px",
                          height: "20px",
                        }}
                      />
                    </div>

                    {/* card container */}
                    <div
                      className="text-decoration-none item d-flex p-2 pt-3 pb-1 flex-column justify-content-start align-items-start border productItem"
                      style={{
                        width: "100%",
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
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* <div className='text-center py-4 text-muted'>{allResults?.length || 0} items found in {category}</div> */}

            <TablePagination
              count={allResults?.length || 0}
              component="div"
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
      <CallToAction />
    </>
  );
}

export default Category;
