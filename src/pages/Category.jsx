import CategoriesTab from "../components/CategoriesTab";
import { Link, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import CatehgoriesTab from "../components/CategoriesTab";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TablePagination,
  TextField,
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
import { useQuery } from "@tanstack/react-query";

const options = [
  "Date (Newest first)",
  "Date (Oldest first)",
  "Alphabetical (A - Z)",
  "Alphabetical (Z - A)",
  "Stock Quantity (Less first)",
  "Stock Quantity (More first)",
];

function Category() {
  const { category } = useParams();
  const fetchItems = async () => {
    const res = await fetch(
      "https://grocery-store-server-theta.vercel.app/api/items"
    );
    if (!res.ok) throw new Error("Failed items fetch");
    return res.json();
  };

  const {
    data: items,
    isLoading: itemsLoading,
    isError: itemsError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [view, setView] = useState("grid");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [columnCount, setColumnCount] = useState(4);
  const [allCategories, setAllCategories] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortedItems, setSortedItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const openMenu = Boolean(anchorEl);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

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

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  // Sort and slice items for current page

  useEffect(() => {
    if (!allResults) return;

    let sorted = [...sortedItems];

    switch (selectedIndex) {
      case 0:
        // Date (Newest first)
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;

      case 1:
        // Date (Oldest first)
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;

      case 2:
        // Alphabetical (A - Z)
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 3:
        // Alphabetical (Z - A)
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case 4:
        // Stock Quantity (Less first)
        sorted.sort((a, b) => a.quantity - b.quantity);
        break;

      case 5:
        // Stock Quantity (More first)
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;

      default:
        // No sorting or reset
        sorted = [...allResults];
        break;
    }

    setSortedItems(sorted);
  }, [selectedIndex, allResults]);

  useEffect(() => {
    const defaultSorted = [...allResults]?.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setSortedItems(defaultSorted);
  }, [allResults]);

  const pagedItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  // Search functionality
  useEffect(() => {
    setSearching(true);

    if (search.trim() !== "" && allResults) {
      // Filter category items based on search query
      const searchResults = allResults.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.store_no.toLowerCase().includes(search.toLowerCase())
      );
      setTimeout(() => {
        setSearching(false);
        setSortedItems(searchResults);
      }, 1000);
    } else {
      setSearching(false);
      setSortedItems(allResults || []);
    }
  }, [search]);

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
                        sx={{
                          color: "var(--text-color)",
                          "&.Mui-checked": {
                            color: "var(--primary-color)",
                          },
                        }}
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
                          sx={{
                            color: "var(--text-color)",
                            "&.Mui-checked": {
                              color: "var(--primary-color)",
                            },
                          }}
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
            <div className="d-flex mb-3 justify-content-between gap-4 align-items-center">
              <h3 className="fw-bold">{category}</h3>

              <div
                className="flex-fill rounded-pill"
                style={{
                  backgroundColor: "var(--background-color)",
                }}
              >
                <TextField
                  autoFocus={true}
                  focused
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search for products ..."
                  className="p-4 py-1 border-0 outline-0 rounded-3 m-0 d-sm-none d-md-block"
                  fullWidth
                  variant="standard"
                  color="primary"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      color: "var(--text-color)", // input text
                      "&::placeholder": {
                        color: "var(--text-light)",
                        opacity: 1, // full opacity
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "var(--text-light)",
                        opacity: 1,
                      },
                    },
                  }}
                />
              </div>
              <div className="d-flex gap-2 align-items-center">
                <GridViewIcon
                  role="button"
                  onClick={() => setView("grid")}
                  style={{
                    color: view === "grid" && "var(--primary-color)",
                    border: view === "grid" && "1px solid var(--text-light)",
                    borderRadius: view === "grid" && "3px",
                  }}
                  fontSize="medium"
                />
                <ViewListIcon
                  role="button"
                  onClick={() => setView("list")}
                  style={{
                    color: view === "list" && "var(--primary-color)",
                    border: view === "list" && "1px solid var(--text-light)",
                    borderRadius: view === "list" && "3px",
                  }}
                  fontSize="medium"
                />

                <span
                  role="button"
                  aria-expanded={openMenu ? "true" : undefined}
                  onClick={handleClickListItem}
                  className="d-flex fw-bold gap-2 align-items-center"
                  title={options[selectedIndex]}
                  style={{
                    color: selectedIndex !== 0 && "var(--primary-color)",
                  }}
                >
                  Sort by &nbsp;
                  <SwapVertIcon fontSize="small" />
                </span>

                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "lock-button",
                      role: "listbox",
                    },
                  }}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <div
                        className="w-100 small"
                        style={{
                          color:
                            index === selectedIndex
                              ? "var(--primary-color)"
                              : "",
                        }}
                      >
                        {option}
                      </div>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>

            <div className="text-center py-4 text-muted mb-3">
              {allResults?.length || 0} items found in {category}
            </div>

            {!itemsLoading ? (
              pagedItems.length > 0 ? (
                <>
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

                  <TablePagination
                    count={sortedItems?.length || 0}
                    component="div"
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ color: "var(--text-color)" }}
                  />
                </>
              ) : (
                <div className="text-center py-4 text-muted mt-5 mb-5">
                  No items found for the selected criteria.
                </div>
              )
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
          </div>
        </div>
      </div>
      <CallToAction />
    </>
  );
}

export default Category;
