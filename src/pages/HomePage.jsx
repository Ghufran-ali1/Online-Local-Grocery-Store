import { ChevronRight } from "@mui/icons-material";
import CategoriesTab from "../components/CategoriesTab";
import ProductPicks from "../components/ProductPicks";
import ProductItem from "../components/ProductItem";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import CallToAction from "../components/CallToAction";
import Header from "../components/Header";
import Footer from "../components/Footer";

























function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const stored = localStorage.getItem("watchlist");
  const currentWatchList = stored ? JSON.parse(stored) : [];
  const [allWatchList, setAllWatchlist] = useState(currentWatchList);

  const storedFav = localStorage.getItem("favorites");
  const currentFavs = storedFav ? JSON.parse(storedFav) : [];
  const [allFavorites, setAllFavorites] = useState(currentFavs);



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
    <>
      <Header />
      <div>
        <div
          className="text-light d-flex justify-content-center py-5 m-0 p-0"
          style={{
            backgroundColor: "var(--primary-dark)", // base color
            backgroundImage: 'url("/media/hero-bg.png")',
            backgroundBlendMode: "normal", // or 'multiply' if you want a tint
            backgroundRepeat: "no-repeat", // no tiling
            backgroundSize: "cover", // keep the whole image visible
            backgroundPosition: "right center", // lock it to the right
            minHeight: "90vh",
          }}
        >
          <div className="container px-4 m-auto rounded-0">
            <div>
              <div className="text-uppercase mb-2">
                <u> Grocery made convenient </u>
              </div>
              <h1 className="fw-bold homeTitle">
                Make your{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  grocery <br /> shopping <u>convenient</u>.
                </span>
              </h1>
              <p className="py-2" style={{ maxWidth: "700px" }}>
                We are committed to providing the best online shopping
                experience with a wide range of products at competitive prices.
                keep your home stocked with essentials and discover new
                favorites with us. from fresh groceries, cold drinks, snacks,
                and household items, we have everything you need delivered right
                to your doorstep.
              </p>
              <a href="/store">
                <button
                  className="text-light mt-2 p-2 px-5 d-flex justify-content-center rounded-pill border-0 outline-0 align-items-center"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  Shop Now &nbsp; &nbsp; <ChevronRight />{" "}
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="container my-3">
          <img
            className="img-fluid"
            src="/media/wide-banner.png"
            alt="banner"
          />
        </div>

        <h4 className="container mt-5 fw-bold">Trending Today</h4>
        <ProductPicks items={items} loading={loading} Trending={true} />

        <h4 className="container mt-5 fw-bold">Top Categories</h4>
        <CategoriesTab items={items} isTopCategories={[true]} />

        <div className="d-flex flex-column gap-4 p-3 bg-light flex-md-row">
          <div
            className="bg-white p-0 w-100 rounded-5 overflow-hidden border"
            style={{
              aspectRatio: "3/4",
              color: "var(--background-color)",
              backgroundImage: 'url("/grocery3.avif")',
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="h-100 w-100 p-4 py-5"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
              }}
            >
              <Link to={"/store"} className="h-100 w-100">
                <p className="text-light">Convenience</p>
                <h2 className="fw-bold">Shop at your convenience.</h2>
                <button className="border-primary border-0 p-0 px-3 text-primary bg-transparent border-bottom">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>

          <div
            className="bg-white p-0 w-100 rounded-5 overflow-hidden border"
            style={{
              aspectRatio: "3/4",
              color: "var(--background-color)",
              backgroundImage: 'url("/grocery2.jpg")',
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="h-100 w-100 p-4 py-5"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
              }}
            >
              <Link to={"/store"} className="h-100 w-100">
                <p className="text-light">Speed</p>
                <h2 className="fw-bold">Save your time. Shop wisely.</h2>
                <button className="border-primary border-0 p-0 px-3 text-primary bg-transparent border-bottom">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>

          <div
            className="bg-white p-0 w-100 rounded-5 overflow-hidden border"
            style={{
              aspectRatio: "3/4",
              color: "var(--background-color)",
              backgroundImage: 'url("/grocery.jpg")',
              backgroundPosition: "right",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="h-100 w-100 p-4 py-5"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
              }}
            >
              <Link to={"/store"} className="h-100 w-100">
                <p className="text-light">Great Deals</p>
                <h2 className="fw-bold">Get amazing offers on all items.</h2>
                <button className="border-primary border-0 p-0 px-3 text-primary bg-transparent border-bottom">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        <h4 className="container mt-5 fw-bold">Top Picks</h4>
        <ProductPicks items={items} loading={loading} Top={true} />

        <h4 className="container mt-5 fw-bold">New Arrivals 🔥</h4>
        <ProductPicks items={items} loading={loading} New={true} />

        <div className="d-flex flex-column gap-4 p-3 bg-light flex-md-row">
          <div
            className="bg-white p-0 w-100 rounded-5 overflow-hidden border"
            style={{
              height: "700px",
              color: "var(--background-color)",
              backgroundImage: 'url("/grocery.jpg")',
              backgroundPosition: "right",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="h-100 w-100 p-4 py-5"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
              }}
            >
              <Link to={"/store/Fruits"} className="h-100 w-100">
                <p>WE CARE FOR YOU!</p>
                <h2 className="fw-bold">Your health matters to us!</h2>
                <button className="border-primary border-0 p-0 px-3 text-primary bg-transparent border-bottom">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
          {/* RIGHT 2x2 panel (fixed height 700px) */}
          <div
            className="p-2 w-100"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: "1rem",
              height: "700px",
              boxSizing: "border-box",
              backgroundColor: "var(--background-light)",
            }}
          >
            {items?.length > 0 ? (
              items
                ?.filter(
                  (i) => i.category === "Fruits" || i.category === "Produce"
                )
                .slice(0, 4)
                .map((item) => (
                  <Link
                    key={item?.id}
                    to={`/store/${item?.category}/${item?.store_no}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-decoration-none position-relative d-block"
                    style={{
                      zIndex: 1,
                      minHeight: 0 /* important for grid/flex shrink */,
                    }}
                  >
                    {/* Card: flex column that fills grid cell */}
                    <div
                      className="bg-light border rounded-3 d-flex flex-column h-100"
                      style={{
                        padding: 0,
                        overflow: "hidden",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Image area (fills remaining space without overflowing) */}
                      <div
                        className="flex-grow-1 d-flex"
                        style={{
                          minHeight: 0,
                          overflow: "hidden" /* allow shrinking */,
                        }}
                      >
                        <img
                          src={item?.gallery?.[0]}
                          alt={item?.name}
                          className="w-100 h-100 p-2"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            display: "block",
                          }}
                        />
                      </div>
                      {/* Top header (fixed height) */}
                      <div className="px-3 py-2" style={{ flex: "0 0 60px" }}>
                        <div className="fw-semibold mb-1">{item?.name}</div>
                        <small className="text-muted">
                          {item?.quantity} Remaining
                        </small>
                      </div>

                      {/* Footer (fixed height for icons/actions) */}
                      <div
                        className="px-2 py-1 d-flex justify-content-end gap-2"
                        style={{ flex: "0 0 44px", alignItems: "center" }}
                      >
                        <button
                          className="btn btn-sm btn-link p-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddWatchlist(item?.store_no);
                          }}
                        >
                          <i
                            className={`bi ${
                              allWatchList.includes(item?.store_no)
                                ? "bi-eye-fill text-primary"
                                : "bi-eye"
                            }`}
                          />
                        </button>

                        <button
                          className="btn btn-sm btn-link p-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddFavorite(item?.store_no);
                          }}
                        >
                          <i
                            className={`bi ${
                              allFavorites.includes(item?.store_no)
                                ? "bi-heart-fill text-danger"
                                : "bi-heart"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="p-2">Loading items ...</div>
            )}
          </div>
        </div>

        <h4 className="container mt-5 fw-bold">Fresh from the Farm 🔥</h4>
        <ProductPicks items={items} loading={loading} Fresh={true} />
      </div>
      <CallToAction />
      <Footer />
    </>
  );
}

export default HomePage;
