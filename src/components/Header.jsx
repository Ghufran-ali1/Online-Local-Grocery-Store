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

const style = {
  position: "absolute",
  top: "100px",
  left: "50%",
  transform: "translate(-50%)",
  width: "100%",
  maxWidth: 700,
  bgcolor: "background.paper",
  boxShadow: 0,
  borderRadius: 4,
  p: 2,
};

function Header() {  
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [openWatchlist, setOpenWatchlist] = useState(false);
  const [openFavorites, setOpenFavorites] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [items, setItems] = useState(null);
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

  const stored = localStorage.getItem("watchlist");
  const currentWatchList = stored ? JSON.parse(stored) : [];
  const [watchlistIdentifiers, setWatchlistIdentifiers] =
    useState(currentWatchList);

  const storedFav = localStorage.getItem("favorites");
  const currentFavs = storedFav ? JSON.parse(storedFav) : [];
  const [favoritesIdentifiers, setFavoritestIdentifiers] =
    useState(currentFavs);
  const [favorites, setFavorites] = useState([]);


  
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
    const refreshLists = () => {
      const storedWatchlistIds = JSON.parse(
        localStorage.getItem("watchlist")
      ) || ["STK476591134199"];
      const mywatchlist = items?.filter((item) =>
        storedWatchlistIds.includes(item.store_no)
      );
      setWatchlist(mywatchlist || []);

      const storedFavoriteIds = JSON.parse(
        localStorage.getItem("favorites")
      ) || ["STK645723076665", "STK476591134199"];
      const favoritesList = items?.filter((item) =>
        storedFavoriteIds.includes(item.store_no)
      );
      setFavorites(favoritesList || []);
    };

    refreshLists();

    // ✅ 3. Same-tab changes (custom event) + cross-tab changes (native storage)
    const handleStorage = (e) => {
      // If it's the native storage event but not one of our keys, ignore
      if (
        e.type === "storage" &&
        e.key &&
        !["watchlist", "favorites"].includes(e.key)
      )
        return;
      refreshLists();
    };

    window.addEventListener("watchlist-updated", handleStorage);
    window.addEventListener("favorites-updated", handleStorage); // optional if you dispatch this too
    window.addEventListener("storage", handleStorage);

    // ✅ 4. Clean up
    return () => {
      window.removeEventListener("watchlist-updated", handleStorage);
      window.removeEventListener("favorites-updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, [items]);

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

  useEffect(() => {
    setSearching(true);

    if (search.trim() !== "" && items) {
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

  const DrawerList = (
    <Box sx={{ width: 450 }} role="presentation">
      <List className="p-0">
        <div
          className="d-flex border-bottom p-3 position-sticky bg-white justify-content-between align-items-center mb-2"
          style={{ top: 0, zIndex: 10 }}
        >
          <h5 className="mb-0 fw-bold">Watchlist</h5>
          <IconButton
            onClick={() => setOpenWatchlist(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {watchlist?.map((item) => (
          <ListItem key={item.id} className="px-3">
            <div className="w-100 position-relative p-2 border rounded-3 mb-2 d-flex gap-2 align-items-center">
              <img
                src={item.gallery[0]}
                alt={item.name}
                className="object-fit-cover me-2 object-position-center"
                style={{ width: "150px", aspectRatio: "1/1" }}
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
                  <IconButton
                    onClick={() => handleAddFavorite(item.store_no)}
                    className="position-relative rounded-pill"
                    aria-label="favorites"
                  >
                    <i
                      className={`bi ${
                        favoritesIdentifiers?.includes(item?.store_no)
                          ? "bi-heart-fill"
                          : "bi-heart"
                      } small`}
                      style={{
                        lineHeight: "0",
                        color: favoritesIdentifiers.includes(item?.store_no)
                          ? "red"
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
      <p className="text-center py-3">{watchlist?.length || 0} items found.</p>
    </Box>
  );

  const FavoritesDrawerList = (
    <Box sx={{ width: 450 }} role="presentation">
      <List className="p-0">
        <div
          className="d-flex border-bottom p-3 position-sticky bg-white justify-content-between align-items-center mb-2"
          style={{ top: 0, zIndex: 10 }}
        >
          <h5 className="mb-0 fw-bold">Favorites</h5>
          <IconButton
            onClick={() => setOpenFavorites(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {favorites?.map((item) => (
          <ListItem key={item.id} className="px-3">
            <div className="w-100 position-relative p-2 border rounded-3 mb-2 d-flex gap-2 align-items-center">
              <img
                src={item.gallery[0]}
                alt={item.name}
                className="object-fit-cover me-2 object-position-center"
                style={{ width: "150px", aspectRatio: "1/1" }}
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
                    onClick={() => handleAddFavorite(item.store_no)}
                    className="text-light w-100 rounded-3 p-1 px-3 bg-danger border-0 small"
                  >
                    Remove
                  </button>
                  <IconButton
                    onClick={() => handleAddWatchlist(item.store_no)}
                    className="position-relative rounded-pill"
                    aria-label="favorites"
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
      <p className="text-center py-3">{favorites?.length || 0} items found.</p>
    </Box>
  );

  const menuDrawerList = (
    <Box sx={{ width: 400 }} role="presentation">
      <List className="p-0">
        <div
          className="d-flex border-bottom p-3 position-sticky bg-white justify-content-between align-items-center mb-2"
          style={{ top: 0, zIndex: 10 }}
        >
          <h5 className="mb-0 fw-bold">Menu</h5>
          <IconButton onClick={() => setOpenMenu(false)} aria-label="close">
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
              <HomeOutlined />
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
              <ShoppingCartCheckoutIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Store" />
          </ListItemButton>
        </Link>

        <ListItemButton onClick={() => setOpenDropdown(!openDropdown)}>
          <ListItemIcon>
            <FormatListBulletedIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
          {openDropdown ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDropdown} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to={`/store/All Categories`} key={"All Categories"}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary={"All Categories"} />
              </ListItemButton>
            </Link>
            {allCategories.map((category) => (
              <Link
                onClick={() => setOpenMenu(false)}
                to={`/store/${category.toLowerCase().replace(/\s+/g, "-")}`}
                key={category}
              >
                <ListItemButton sx={{ pl: 4 }} key={category}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={category} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
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

  const handleAddFavorite = (store_no) => {
    const stored = localStorage.getItem("favorites");
    const current = stored ? JSON.parse(stored) : [];

    let updated;
    if (!current.includes(store_no)) {
      updated = [...current, store_no];
    } else {
      updated = current.filter((no) => no !== store_no);
    }

    setFavoritestIdentifiers(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    window.dispatchEvent(new Event("favorites-updated"));
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
                placeholder="Search for products..."
                className="p-2 pt-1 border-0 outline-0"
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
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
              className="p-3 pt-2 border rounded-2"
              style={{ maxHeight: "700px", overflowY: "auto" }}
            >
              {search.trim() !== "" && (
                <h6 className="m-0" style={{ color: "var(--primary-light)" }}>
                  Search results for <strong>"{search}"</strong>
                </h6>
              )}
              <div>
                {searching ? (
                  [...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="border-bottom w-100 rounded-3 mb-2 p-1 px-2 mt-0"
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
                          to={`/store/${item.category
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/${item.store_no}`}
                          key={item.id}
                          onClick={()=> setOpen(false)}
                        >
                          <div className="border-bottom w-100 rounded-3 searchhover mb-2 p-1 px-2 mt-0 d-flex gap-2 align-items-center">
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
                  <p className="text-center p-3 text-danger">
                    No results found!
                  </p>
                )}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>

      <SwipeableDrawer
        open={openMenu}
        anchor="right"
        onClose={() => setOpenMenu(false)}
      >
        {menuDrawerList}
      </SwipeableDrawer>

      <SwipeableDrawer
        open={openWatchlist}
        anchor="right"
        onClose={() => setOpenWatchlist(false)}
      >
        {DrawerList}
      </SwipeableDrawer>

      <SwipeableDrawer
        open={openFavorites}
        anchor="right"
        onClose={() => setOpenFavorites(false)}
      >
        {FavoritesDrawerList}
      </SwipeableDrawer>

      <nav className="container d-flex justify-content-between align-items-center mx-auto">
        <Link to="/">
          <img src="/media/logo.png" alt="Logo" height={35} />
        </Link>

        <ul className="list-unstyled mb-0 gap-3 d-none d-md-flex">
          <li>
            <NavLink className={({ isActive }) => isActive ? "active" : ""} end to="/store">Store</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => isActive ? "active" : ""} end to="/store/All Categories">All Categories</NavLink>
          </li>
          {topCategories?.map((category) => (
            <li key={category}>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} end to={`/store/${category}`}>{category}</NavLink>
            </li>
          ))}
        </ul>
        <div className="d-flex gap-2 align-items-center">
          <IconButton
            onClick={() => setOpen(true)}
            className="position-relative rounded-pill"
            aria-label="favorites"
          >
            <i className="bi bi-search" style={{ lineHeight: "0" }}></i>
          </IconButton>
          <IconButton
            onClick={() => setOpenWatchlist(true)}
            className="position-relative rounded-pill"
            aria-label="watchlist"
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
            onClick={() => setOpenFavorites(true)}
            className="position-relative rounded-pill"
            aria-label="favorites"
          >
            <Badge
              badgeContent={favorites?.length || 0}
              color="error"
              overlap="circular"
            >
              <i className="bi bi-heart" style={{ lineHeight: "0" }}></i>
            </Badge>
          </IconButton>
          <IconButton
            onClick={() => setOpenMenu(true)}
            className="position-relative rounded-pill d-md-none"
            aria-label="menu"
          >
            <i className="bi bi-list" style={{ lineHeight: "0" }}></i>
          </IconButton>
        </div>
      </nav>
    </div>
  );
}

export default Header;
