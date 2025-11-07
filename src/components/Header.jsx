import { Badge, Collapse, IconButton, TextField } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { HomeOutlined } from "@mui/icons-material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CategoryIcon from "@mui/icons-material/Category";
import { useQuery } from "@tanstack/react-query";


const getStatus = (date) => {
  const reservedDate = new Date(date);
  const today = new Date();

  // Strip time for both dates
  reservedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (reservedDate < today) {
    return (
      <span className="text-danger alert alert-danger text-center w-100 rounded-3 p-1 px-3 border-0 small">
        Overdue
      </span>
    );
  } else if (reservedDate > today) {
    return (
      <span className="text-success alert alert-success text-center w-100 rounded-3 p-1 px-3 border-0 small">
        Upcoming
      </span>
    );
  } else {
    return (
      <span className="text-primary alert alert-primary text-center w-100 rounded-3 p-1 px-3 border-0 small">
        Due Today
      </span>
    );
  }
};
const style = {
  position: "absolute",
  top: { xs: 0, sm: "100px" },
  left: { xs: 0, sm: "50%" },
  transform: { xs: "none", sm: "translateX(-50%)" },
  width: { xs: "100vw", sm: "90%", md: "700px" },
  minHeight: { xs: "100vh", sm: "auto" },
  maxHeight: "100vh",
  overflowY: "auto",
  bgcolor: "var(--background-color)",
  boxShadow: 0,
  borderRadius: { xs: 0, sm: 4 },
  color: "var(--text-color)",
  p: 2,
};

// Determine initial user preferred theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme; // User has a saved preference

  // No saved preference, check system preference
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return systemPrefersDark ? "dark" : "light";
};

function Header() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [openWatchlist, setOpenWatchlist] = useState(false);
  const [openReservations, setOpenReservations] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
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
  const [reservedItems, setReservedItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([
    "Fruits",
    "Vegetables",
    "Snacks",
    "Beverages",
    "Meat",
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme);

  const stored = localStorage.getItem("watchlist");
  const currentWatchList = stored ? JSON.parse(stored) : [];
  const [watchlistIdentifiers, setWatchlistIdentifiers] =
    useState(currentWatchList);

  const storedReserves = localStorage.getItem("reservations");
  const currentReserves = storedReserves ? JSON.parse(storedReserves) : [];
  const [reservationsIdentifiers, setReservationsIdentifiers] =
    useState(currentReserves);
  const [reservations, setReservations] = useState([]);

  // Apply theme to document + listen for changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync with system theme only if user hasn't manually changed theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle button
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    window.dispatchEvent(new Event("themeChanged"));
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch(
          "https://grocery-store-server-theta.vercel.app/api/reservations"
        );
        if (!res.ok) throw new Error("Failed reservations fetch");
        setReservedItems(await res.json());
      } catch (err) {
        console.error(err);
        setReservedItems([]);
      }
    };

    fetchItems();
    fetchReservations();

    const handleStorage = (e) => {
      if (
        (e.type === "storage" && e.key === "reservations") ||
        e.type === "reservations-updated"
      ) {
        // ✅ when localStorage changes, fetch fresh from server
        fetchReservations();
      }
    };

    // ✅ watch both same-tab & cross-tab updates
    window.addEventListener("reservations-updated", handleStorage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("reservations-updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!items?.length || !reservedItems?.length) {
      return;
    }

    let myReservations = [];

    const refreshLists = () => {
      const storedWatchlistIds =
        JSON.parse(localStorage.getItem("watchlist")) || [];
      const mywatchlist = items?.filter((item) =>
        storedWatchlistIds.includes(item.store_no)
      );
      setWatchlist(mywatchlist || []);

      const storedReservationIds =
        JSON.parse(localStorage.getItem("reservations")) || [];

      // merge reservations data with the item whose store no matches
      myReservations = reservedItems
        ?.filter((res) => storedReservationIds.includes(res.rsv_no)) // pick only reserved ones
        .map((res) => {
          const itemDetails = items?.find(
            (item) => item.store_no === res.store_no
          );
          return itemDetails
            ? { ...res, ...itemDetails, reserved_quantity: res.quantity }
            : res;
        });

      setReservations(myReservations || []);
    };

    refreshLists();

    // ✅ 3. Same-tab changes (custom event) + cross-tab changes (native storage)
    const handleStorage = (e) => {
      if (
        e.type === "storage" &&
        e.key &&
        !["watchlist", "reservations"].includes(e.key)
      )
        return;
      refreshLists();
    };

    window.addEventListener("watchlist-updated", handleStorage);
    window.addEventListener("reservations-updated", handleStorage);
    window.addEventListener("storage", handleStorage);

    // ✅ 4. Clean up event listeners on unmount
    return () => {
      window.removeEventListener("watchlist-updated", handleStorage);
      window.removeEventListener("reservations-updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, [items, reservedItems]);

  useEffect(() => {
    if (items) {
      const categories = items
        ?.map((item) => item.category)
        .reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
      const sortedCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name);
      setTopCategories(sortedCategories);
      setAllCategories(Object.keys(categories));
    }
  }, [items]);

  // Search functionality
  useEffect(() => {
    setSearching(true);

    if (search.trim() !== "" && items) {
      // Filter items based on search query
      const searchResults = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.store_no.toLowerCase().includes(search.toLowerCase())
      );
      setTimeout(() => {
        setSearching(false);
        setSearchResults(searchResults);
      }, 1000);
    } else {
      setSearching(false);
      setSearchResults([]);
    }
  }, [search]);

  // Drawer contents for Watchlist
  const DrawerList = (
    <Box className="p-0" role="presentation">
      <List className="p-0 m-0">
        <div
          className="d-flex border-bottom p-3 position-sticky justify-content-between align-items-center mb-2"
          style={{
            top: 0,
            zIndex: 10,
            backgroundColor: "var(--background-color)",
          }}
        >
          <h5 className="mb-0 fw-bold" style={{ color: "var(--text-color)" }}>
            Watchlist
          </h5>
          <IconButton
            onClick={() => setOpenWatchlist(false)}
            aria-label="close"
            sx={{ color: "var(--text-color)" }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {watchlist?.map((item) => (
          <ListItem key={item.id} className="px-3">
            <div
              className="w-100 position-relative p-2 rounded-3 mb-2 d-flex gap-2 align-items-center"
              style={{ border: "1px solid var(--text-light)" }}
            >
              <img
                src={item?.gallery[0] || ""}
                alt={item.name}
                className="object-fit-cover me-2 object-position-center"
                style={{ width: "35%", aspectRatio: "1/1" }}
              />
              <div className="w-100">
                <Link to={`/store/${item.category}/${item.store_no}`}>
                  <p className="fs-6 mb-0">{item.name}</p>
                </Link>
                <small style={{ color: "var(--text-light)" }}>
                  {item.views} views | {item.quantity} remaining{" "}
                </small>
                <div className="d-flex pt-0 small">
                  {item.stock && (
                    <span className="text-success p-1 px-0 small">
                      In stock &nbsp; <i className="bi bi-check-circle"></i>
                    </span>
                  )}
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <button
                    onClick={() => handleAddWatchlist(item.store_no)}
                    className="text-light w-100 rounded-3 p-1 px-3 bg-danger border-0 small"
                  >
                    Remove
                  </button>
                  {/* <IconButton
                    onClick={() => handleAddReservation(item.store_no)}
                    className="position-relative rounded-pill"
                    aria-label="reservations"
                  >
                    <i
                      className={`bi ${
                        reservationsIdentifiers?.includes(item?.store_no)
                          ? "bi-heart-fill"
                          : "bi-heart"
                      } small`}
                      style={{
                        lineHeight: "0",
                        color: reservationsIdentifiers?.includes(item?.store_no)
                          ? "red"
                          : "",
                      }}
                    ></i>
                  </IconButton> */}
                </div>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      <p className="text-center py-3">{watchlist?.length || 0} items found.</p>
    </Box>
  );

  // Drawer contents for Reservations
  const ReservationsDrawerList = (
    <Box className="p-0" role="presentation">
      <List className="p-0">
        <div
          className="d-flex border-bottom p-3 position-sticky justify-content-between align-items-center mb-2"
          style={{
            top: 0,
            zIndex: 10,
            backgroundColor: "var(--background-color)",
          }}
        >
          <h5 className="mb-0 fw-bold" style={{ color: "var(--text-color)" }}>
            Reservations
          </h5>
          <IconButton
            onClick={() => setOpenReservations(false)}
            aria-label="close"
            sx={{ color: "var(--text-color)" }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {reservations?.map((item, index) => (
          <ListItem key={index} className="px-3">
            <div
              className="w-100 position-relative p-2 rounded-3 mb-2 d-flex gap-2 align-items-center"
              style={{ border: "1px solid var(--text-light)" }}
            >
              <img
                src={item?.gallery?.[0] || null}
                alt={item?.name}
                className="object-fit-cover me-2 object-position-center p-1"
                style={{ width: "150px", aspectRatio: "1/1" }}
              />
              <div className="w-100">
                <div
                  className="w-100 d-flex justify-content-end small"
                  style={{ color: "var(--text-light)", lineHeight: 1 }}
                >
                  {new Date(item?.reserved_on).toLocaleString()}
                </div>
                <Link to={`/store/${item?.category}/${item?.store_no}`}>
                  <p className="fs-6 mb-0">{item?.name}</p>
                </Link>
                <small style={{ color: "var(--text-light)" }}>
                  <span className="text-success">Reserved</span> | {item?.views}{" "}
                  views | {item?.quantity} remaining{" "}
                </small>
                <div className="d-flex pt-0 small">
                  {/* {item.stock && (
                    <span className="text-success p-1 px-0 small">
                      In stock &nbsp; <i className="bi bi-check-circle"></i>
                    </span>
                  )} */}

                  <span className="text-success p-1 px-0 small">
                    {item?.reserved_quantity || 0} items reserved &nbsp;{" "}
                    <i className="bi bi-check-circle"></i>
                  </span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    {getStatus(item.date)}
                  <IconButton
                    onClick={() => handleAddWatchlist(item.store_no)}
                    className="position-relative rounded-pill"
                    aria-label="reservations"
                  >
                    <i
                      className={`bi ${
                        watchlistIdentifiers?.includes(item?.store_no)
                          ? "bi-eye-fill"
                          : "bi-eye"
                      } small`}
                      style={{
                        lineHeight: "0",
                        color: watchlistIdentifiers.includes(item?.store_no)
                          ? "var(--primary-color)"
                          : "",
                      }}
                    ></i>
                  </IconButton>
                </div>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      <p className="text-center py-3">
        {reservations.length > 0 ? reservations.length : "no"} reservations
        found.
      </p>
    </Box>
  );

  // Drawer contents for Menu
  const menuDrawerList = (
    <Box className="p-0" role="presentation">
      <List className="p-0">
        <div
          className="d-flex border-bottom p-3 position-sticky justify-content-between align-items-center mb-2"
          style={{
            top: 0,
            zIndex: 10,
            backgroundColor: "var(--background-color)",
          }}
        >
          <h5 className="mb-0 fw-bold" style={{ color: "var(--text-color)" }}>
            Menu
          </h5>
          <IconButton
            onClick={() => setOpenMenu(false)}
            aria-label="close"
            sx={{ color: "var(--text-color)" }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <Link
          onClick={() => setOpenMenu(false)}
          to="/"
          key={"home"}
          className="text-decoration-none"
        >
          <ListItemButton>
            <ListItemIcon>
              <HomeOutlined sx={{ color: "var(--text-color)" }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </Link>

        <Link
          onClick={() => setOpenMenu(false)}
          to="/store"
          key={"store"}
          className="text-decoration-none"
        >
          <ListItemButton>
            <ListItemIcon>
              <ShoppingCartCheckoutIcon sx={{ color: "var(--text-color)" }} />
            </ListItemIcon>
            <ListItemText primary="Store" />
          </ListItemButton>
        </Link>

        <ListItemButton onClick={() => setOpenDropdown(!openDropdown)}>
          <ListItemIcon>
            <FormatListBulletedIcon sx={{ color: "var(--text-color)" }} />
          </ListItemIcon>
          <ListItemText primary="Categories" />
          {openDropdown ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDropdown} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to={`/store/All Categories`} key={"All Categories"}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CategoryIcon sx={{ color: "var(--text-color)" }} />
                </ListItemIcon>
                <ListItemText primary={"All Categories"} />
              </ListItemButton>
            </Link>
            {allCategories.map((category) => (
              <Link
                onClick={() => setOpenMenu(false)}
                to={`/store/${category}`}
                key={category}
              >
                <ListItemButton sx={{ pl: 4 }} key={category}>
                  <ListItemIcon>
                    <CategoryIcon sx={{ color: "var(--text-color)" }} />
                  </ListItemIcon>
                  <ListItemText primary={category} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>

        <div
          role="button"
          className="d-flex gap-2 align-items-center px-2 p-2 px-3 my-3 cursor-pointer d-flex justify-content-between flex-row-reverse"
          onClick={() => {
            toggleTheme();
          }}
          style={{ backgroundColor: "var(--background-light)" }}
        >
          <i
            className={`bi ${
              theme === "dark" ? "bi-sun" : "bi-moon-stars-fill"
            } me-1 fs-5`}
            style={{ lineHeight: 0 }}
          ></i>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </div>
      </List>
      <p className="text-center py-3">&copy; All rights reserved 2025</p>
    </Box>
  );

  const handleAddWatchlist = (store_no) => {
    const stored = localStorage.getItem("watchlist");
    const current = stored ? JSON.parse(stored) : [];

    let updated;
    if (!current.includes(store_no)) {
      updated = [...current, store_no];
    } else {
      updated = current.filter((no) => no !== store_no);
    }

    setWatchlistIdentifiers(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));

    window.dispatchEvent(new Event("watchlist-updated"));
  };


  const handleCancelReservation = (rsv_no) => {
    const stored = localStorage.getItem("reservations");
    const current = stored ? JSON.parse(stored) : [];

    let updated;
    if (!current.includes(rsv_no)) {
      updated = [...current, rsv_no];
    } else {
      updated = current.filter((no) => no !== rsv_no);
    }

    setReservationsIdentifiers(updated);
    localStorage.setItem("reservations", JSON.stringify(updated));

    window.dispatchEvent(new Event("reservations-updated"));
  };
  

  return (
    <div
      className="p-2 header position-sticky top-0 mb-2"
      style={{ zIndex: 1000 }}
    >
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form
              onSubmit={(e) => e.preventDefault()}
              id="subscription-form"
              className="d-flex gap-2 align-items-center justify-content-between border-bottom mb-3"
            >
              <i className="bi bi-search fs-5" style={{ lineHeight: "0" }}></i>
              <TextField
                autoFocus={true}
                focused
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search for products ..."
                className="p-2 pt-1 border-0 outline-0"
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
              <i
                role="button"
                onClick={() => setOpen(false)}
                className="bi bi-x-lg text-danger fs-5"
                style={{ lineHeight: "0" }}
              ></i>
            </form>
            <div
              className="p-3 pt-2 rounded-2"
              style={{
                maxHeight: "auto",
                overflowY: "auto",
                border: "1px solid var(--text-light)",
              }}
            >
              {search.trim() !== "" ? (
                <>
                  <h6
                    className="m-0 fw-semibold mt-1 mb-2"
                    style={{ color: "var(--text-light)" }}
                  >
                    Search results for <strong>"{search}"</strong>
                  </h6>

                  <div>
                    {searching ? (
                      [...Array(6)].map((_, index) => (
                        <div
                          key={index}
                          className="w-100 rounded-3 mb-2 p-1 px-2 mt-0"
                          style={{
                            borderBottom: "1px solid var(--text-light)",
                          }}
                        >
                          <p className="m-0 mb-1 fw-semibold">
                            <span className="placeholder rounded-2 col-4 placeholder-glow"></span>
                          </p>
                          <small style={{ color: "var(--text-light)" }}>
                            <span className="placeholder rounded-1 col-3 placeholder-glow"></span>{" "}
                            |{" "}
                            <span className="placeholder rounded-1 col-2 placeholder-glow"></span>{" "}
                            |{" "}
                            <span className="placeholder rounded-1 col-2 placeholder-glow"></span>
                          </small>
                        </div>
                      ))
                    ) : searchResults && searchResults.length > 0 ? (
                      Object.entries(
                        searchResults.reduce((acc, item) => {
                          acc[item.category] = acc[item.category] || [];
                          acc[item.category].push(item);
                          return acc;
                        }, {})
                      ).map(([category, items]) => (
                        <div key={category} className="mb-3">
                          <strong
                            className="d-block mb-1 mt-3 text-uppercase"
                            style={{ color: "var(--text-light)" }}
                          >
                            {category}
                          </strong>
                          {items.map((item) => (
                            <Link
                              to={`/store/${item.category}/${item.store_no}`}
                              key={item.id}
                              onClick={() => setOpen(false)}
                            >
                              <div
                                className="w-100 rounded-3 searchhover mb-2 p-1 px-2 mt-0 d-flex gap-2 align-items-center"
                                style={{
                                  borderBottom: "1px solid var(--text-light)",
                                }}
                              >
                                <img
                                  src={item.gallery[0]}
                                  alt={""}
                                  className="p-1 bg-light"
                                  style={{
                                    width: "70px",
                                    aspectRatio: "1/1",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    objectPosition: "center",
                                  }}
                                />

                                <div>
                                  <p className="m-0 mb-1 fw-semibold">
                                    {item.name}
                                  </p>
                                  <small style={{ color: "var(--text-light)" }}>
                                    {item.quantity} Remaining |{" "}
                                    {item.stock && (
                                      <span className="text-success">
                                        In stock{" "}
                                        <i className="bi bi-check-circle"></i>
                                      </span>
                                    )}
                                  </small>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p className="text-center p-5 mt-2 text-danger">
                        No results found!
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center p-5 mt-2 text-info">
                  Type something to start searching!
                </p>
              )}
            </div>
          </Box>
        </Fade>
      </Modal>

      <SwipeableDrawer
        open={openMenu}
        anchor="right"
        onClose={() => setOpenMenu(false)}
        PaperProps={{
          sx: {
            backgroundColor: "var(--background-color)",
            color: "var(--text-color)",
            padding: 0,
            width: { xs: "100vw", sm: "450px" },
          },
        }}
      >
        {menuDrawerList}
      </SwipeableDrawer>

      <SwipeableDrawer
        open={openWatchlist}
        anchor="right"
        onClose={() => setOpenWatchlist(false)}
        PaperProps={{
          sx: {
            backgroundColor: "var(--background-color)",
            color: "var(--text-color)",
            padding: 0,
            width: { xs: "100vw", sm: "550px" },
          },
        }}
      >
        {DrawerList}
      </SwipeableDrawer>

      <SwipeableDrawer
        open={openReservations}
        anchor="right"
        onClose={() => setOpenReservations(false)}
        PaperProps={{
          sx: {
            backgroundColor: "var(--background-color)",
            color: "var(--text-color)",
            padding: 0,
            width: { xs: "100vw", sm: "550px" },
          },
        }}
      >
        {ReservationsDrawerList}
      </SwipeableDrawer>

      <nav className="container d-flex justify-content-between align-items-center mx-auto">
        <Link to="/">
          <img src="/media/logo.png" alt="Logo" height={35} />
        </Link>

        <ul className="list-unstyled mb-0 gap-3 d-none d-md-flex">
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              end
              to="/store"
            >
              Store
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              end
              to="/store/All Categories"
            >
              All Categories
            </NavLink>
          </li>
          {topCategories?.map((category) => (
            <li key={category}>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                end
                to={`/store/${category}`}
              >
                {category}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="d-flex gap-2 align-items-center">
          <IconButton
            onClick={() => setOpen(true)}
            className="position-relative rounded-pill"
            aria-label="reservations"
            style={{ color: "var(--text-color)" }}
          >
            <i className="bi bi-search" style={{ lineHeight: "0" }}></i>
          </IconButton>
          <IconButton
            onClick={() => setOpenWatchlist(true)}
            className="position-relative rounded-pill"
            aria-label="watchlist"
            style={{ color: "var(--text-color)" }}
          >
            <Badge
              badgeContent={watchlist?.length || 0}
              color="error"
              overlap="circular"
            >
              <i className="bi bi-eye" style={{ lineHeight: "0" }}></i>
            </Badge>
          </IconButton>
          <IconButton
            onClick={() => setOpenReservations(true)}
            className="position-relative rounded-pill"
            aria-label="reservations"
            style={{ color: "var(--text-color)" }}
          >
            <Badge
              badgeContent={reservations?.length || 0}
              color="error"
              overlap="circular"
            >
              <i className="bi bi-cart" style={{ lineHeight: "0" }}></i>
            </Badge>
          </IconButton>
          <div
            role="button"
            className="d-flex gap-2 rounded-3 align-items-center px-2 p-1 mx-1 cursor-pointer d-none d-md-flex"
            onClick={() => {
              toggleTheme();
            }}
          >
            <i
              className={`bi ${
                theme === "dark" ? "bi-sun" : "bi-moon-stars-fill"
              } me-1 fs-5`}
              style={{ lineHeight: 0 }}
            ></i>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </div>
          <IconButton
            onClick={() => setOpenMenu(true)}
            className="position-relative rounded-pill d-md-none"
            aria-label="menu"
            style={{ color: "var(--text-color)" }}
          >
            <i className="bi bi-list" style={{ lineHeight: "0" }}></i>
          </IconButton>
        </div>
      </nav>
    </div>
  );
}

export default Header;
