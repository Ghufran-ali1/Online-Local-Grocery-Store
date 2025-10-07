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
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ProductItem from "../components/ProductItem";
import Footer from "../components/Footer";
import AppBreadcrumbs from "../components/Breadcrumbs";
import Header from "../components/Header";
import CallToAction from "../components/Calltoaction";
import NewItemCreateCTA from "../components/NewItemCreateCTA";

function Store() {
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Default Order");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [columnCount, setColumnCount] = useState(4);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  fetch("https://grocery-store-server-theta.vercel.app/api/items")
    .then((res) => res.json())
    .then((data) => setItems(data))
    .catch((err) => setItems([]))
    .finally(() => setLoading(false));
}, []);

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
    return items?.slice().sort((a, b) => a.id - b.id) || [];
  }, [items]);

  const pagedItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  return (
    <>
      <Header />
      <AppBreadcrumbs />
      <div className="container m-auto min-vh-100">
        <CatehgoriesTab items={items} />
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
          </div>
          <div
            className="p-3 col-12 col-md-9 rounded-3"
            style={{
              backgroundColor: "var(--background-light)",
              minHeight: "50vh",
            }}
          >
            <div className="d-flex justify-content-between mt-1 mb-2 align-items-center">
              <h3 className="fw-bold">All Products</h3>
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
            {items?.length > 0 ? (
              <div
                className="d-grid gap-3 justify-content-start"
                style={{
                  // 👉 gridTemplateColumns collapses to 1 column for list view
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
              <div className="text-center p-5 w-100">
                {loading ? (
                  <div>Loading items ...</div>
                ) : (
                  <span>Loading items ...</span>
                )}
              </div>
            )}

            <TablePagination
              count={items?.length || 0}
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
      <Footer />
    </>
  );
}

export default Store;
