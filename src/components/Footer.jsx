import { Link } from "react-router";
import { useEffect, useState } from "react";
import LastPageIcon from "@mui/icons-material/LastPage";
import IconButton from "@mui/material/IconButton";
import { useQuery } from "@tanstack/react-query";

function Footer() {
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
  const [topCategories, setTopCategories] = useState([
    "Fruits",
    "Vegetables",
    "Snacks",
    "Beverages",
    "Meat",
  ]);

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
    }
  }, [items]);

  return (
    <div
      className="mt-3 p-3 pb-2 position-relative"
      style={{ backgroundColor: "var(--background-light)" }}
    >
      <IconButton
        aria-label="scroll to top"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "var(--primary-color)",
          color: "var(--background-color)",
          zIndex: 1000,
          transform: "rotate(-90deg)",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <LastPageIcon sx={{color: 'white'}} />
      </IconButton>
      <footer
        className="container m-auto d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 pt-3 pb-2"
        style={{ borderTop: "1px solid var(--primary-light)" }}
      >
        <div className="col-12 col-md-6 p-2">
          <img src="/media/logo.png" height={40} alt="Logo" className="mb-3" />
          <div>
            <p>
              We are committed to providing the best online shopping experience
              with a wide range of products at competitive prices. keep your
              home stocked with essentials and discover new favorites with us.
              from fresh groceries, cold drinks, snacks, and household items, we
              have everything you need delivered right to your doorstep.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-2 p-2">
          <h5 className="fw-semibold mt-3">Quick Links</h5>
          <div>
            <ol>
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/"
                className="text-decoration-none"
              >
                <li className="mb-2">Home</li>
              </Link>
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/store"
                className="text-decoration-none"
              >
                <li className="mb-2">Store</li>
              </Link>
              {topCategories?.map((category) => (
                <Link
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  key={category}
                  to={`/store/${category}`}
                  className="text-decoration-none"
                >
                  <li className="mb-2">{category}</li>
                </Link>
              ))}
            </ol>
          </div>
        </div>

        <div className="col-12 col-md-4 p-2">
          <h5 className="fw-semibold mt-3">Contact Us</h5>
          <p className="small m-0 text-muted">
            If you have any questions or feedback, feel free to reach out to the
            store!
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!e.target[0].value.trim() || !e.target[1].value) {
                alert("Please fill in all fields.");
                return 0;
              }
              e.target.reset();
              alert("Enquiry sent successfully!");
            }}
          >
            <div>
              <label className="fw-semibold small">Name:</label>
              <input
                type="text"
                className="form-control p-2 px-3 border-0 outline-0 shadow-none mt-1 mb-2"
                style={{
                  backgroundColor: "var(--primary-light)",
                  color: "var(--text-color)",
                }}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="fw-semibold small">Email address:</label>
              <input
                type="email"
                className="form-control p-2 px-3 border-0 outline-0 shadow-none mt-1 mb-2"
                style={{
                  backgroundColor: "var(--primary-light)",
                  color: "var(--text-color)",
                }}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="fw-semibold small">Enter message:</label>
              <textarea
                className="form-control p-2 border-0 outline-0 shadow-none mt-1 mb-2"
                style={{
                  backgroundColor: "var(--primary-light)",
                  color: "var(--text-color)",
                }}
                placeholder="Enter your message"
                rows={5}
              />
            </div>
            <button
              type="submit"
              className="text-light small border-0 outline-0 p-2 w-100 mt-3 rounded-pill"
              style={{
                cursor: "pointer",
                backgroundColor: "var(--secondary-dark)",
              }}
            >
              Send enquiry
            </button>
          </form>
        </div>
      </footer>
      <p className="text-center mb-1">
        © 2025 Ghufran Online Store. All rights reserved.
      </p>
      <p className="text-center mb-1 text-muted small">
        v1.0.0 - Developed by Ghufran Ahmad
      </p>
    </div>
  );
}

export default Footer;
