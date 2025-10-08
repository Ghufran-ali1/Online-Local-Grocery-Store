import React from "react";
import { Link } from "react-router";

function CallToAction() {
  return (
    <div
      className="mt-3 mb-4 text-center py-5"
      style={{ backgroundColor: "var(--primary-light)" }}
    >
      <p>Our Online grocery store is Now Open!</p>
      <Link to={"/store"}>
        <button
          type="submit"
          className="text-light small border-0 outline-0 p-2 px-5 mt-3 rounded-pill"
          style={{
            cursor: "pointer",
            backgroundColor: "var(--secondary-dark)",
          }}
          onClick={() => {
            window.scrollTo(0, 0, { behavior: "smooth" });
          }}
        >
          Start Shopping
        </button>
      </Link>
    </div>
  );
}

export default CallToAction;
