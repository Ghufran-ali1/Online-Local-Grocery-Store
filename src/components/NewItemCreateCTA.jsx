import React from "react";
import { Link } from "react-router";

function NewItemCreateCTA() {
  return (
    <div
      className="mt-3 mb-4 text-center py-4 rounded"
      style={{ backgroundColor: "var(--primary-light)" }}
    >
      <p>Want to create new items?</p>
      <Link to={"/admin"}>
        <button
          type="submit"
          className="text-light small border-0 outline-0 px-4 p-2 mt-2 rounded-pill"
          style={{
            cursor: "pointer",
            backgroundColor: "var(--primary-color)",
          }}
        >
          Open Admin Page
        </button>
      </Link>
    </div>
  );
}

export default NewItemCreateCTA;
