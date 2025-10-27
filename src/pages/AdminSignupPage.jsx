import React, { useContext, useState } from "react";
import { Link } from "react-router";
import AppBreadcrumbs from "../components/Breadcrumbs";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { CircularProgress } from "@mui/material";
import { GppBadOutlined } from "@mui/icons-material";

function AdminSignupPage() {
  const { adminDetails, isLoading } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handlesignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    document.getElementById("submit").disabled = true;
    document.getElementById("submit").innerText = "Signing up...";

    setMessage("");
    try {
      const response = await axios.post(
        "https://grocery-store-server-theta.vercel.app/api/signup",
        {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          created_by: adminDetails?.id || "self",
          password: formData.password
        }
      );

      setMessage("Signup successful! You can now log in.");
      setFormData({
        username: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 3000);
    } catch (error) {
      let msg = "Signup failed. Please try again.";

      // Axios error with a server response
      if (error.response) {
        const { status, data } = error.response;

        // Check if server sent a PostgreSQL duplicate key message
        if (
          status === 409 ||
          /duplicate key/i.test(data?.error || data?.message)
        ) {
          msg = "Username or email already exists. Please use a different one.";
        } else if (data?.message) {
          msg = `Signup failed: ${data.message}`;
        }
      }
      // Network / unexpected errors
      else if (error.request) {
        msg = "No response from server. Please check your connection.";
      } else {
        msg = `Unexpected error: ${error.message}`;
      }

      setMessage(msg);

      const btn = document.getElementById("submit");
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Signup Now";
      }
    }
  };
  return (
    <>
      <AppBreadcrumbs />
      <div className="container m-auto pb-3">
        <div className="border p-3 rounded-3 mb-3">
          <h3 className="fw-semibold">NEW ADMINISTRATOR</h3>
          <div className="d-flex flex-column flex-lg-row gap-3">
            <div className="w-100">
              {
                isLoading ? <div className="d-flex flex-column gap-3 justify-content-center align-items-center py-5 text-muted">
                          <CircularProgress size={25} />
                          Authenticating ...
                        </div> : adminDetails && adminDetails?.role === "Manager" || adminDetails?.role === "Executive" ? <>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handlesignup();
                            }}
                          >
                            <div>
                              <label htmlFor="username">Username</label>
                              <input
                                value={formData.username}
                                onChange={(e) =>
                                  setFormData({ ...formData, username: e.target.value })
                                }
                                className="w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2"
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  backgroundColor: "var(--primary-light)",
                                }}
                                type="text"
                                id="username"
                              />
                            </div>
                            <div>
                              <label htmlFor="email">Email</label>
                              <input
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2"
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  backgroundColor: "var(--primary-light)",
                                }}
                                type="email"
                                id="email"
                              />
                            </div>
                            <div>
                              <label htmlFor="role">Role</label>
                              <select
                                value={formData.role}
                                onChange={(e) =>
                                  setFormData({ ...formData, role: e.target.value })
                                }
                                className="w-100 mt-1 mb-3 border-0 p-3 px-3 rounded-2"
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  backgroundColor: "var(--primary-light)",
                                }}
                                type="text"
                                id="role"
                              >
                                <option value="">Select Role</option>
                                <option value="Executive">Executive</option>
                                <option value="Manager">Manager</option>
                                <option value="Staff">Staff</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="password">Password</label>
                              <input
                                value={formData.password}
                                onChange={(e) =>
                                  setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2"
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  backgroundColor: "var(--primary-light)",
                                }}
                                type="password"
                                id="password"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirm-password">Confirm Password</label>
                              <input
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                className="w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2"
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  backgroundColor: "var(--primary-light)",
                                }}
                                type="password"
                                id="confirm-password"
                              />
                            </div>
            
                            {message !== "" && (
                              <small
                                className={`${
                                  message.includes("successful")
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {message}
                              </small>
                            )}
            
                            <button
                              id="submit"
                              type="submit"
                              className="text-light small border-0 outline-0 p-2 w-100 mt-3 rounded-pill"
                              style={{
                                cursor: "pointer",
                                backgroundColor: "var(--secondary-dark)",
                              }}
                            >
                              Signup Now
                            </button>
                          </form>
                        </> : 
        <div className="d-flex flex-column gap-2 justify-content-center align-items-center py-5 my-4 text-muted">
          <GppBadOutlined fontSize="large" color="error" />
          Access Denied!
          <small className="text-muted">You must be logged in as an administrator to access this page.</small>
        </div>
              }
            </div>
            <div className="w-100 d-flex justify-content-center align-items-center flex-column text-center p-3 gap-2">
              <h3>Login</h3>
              <small>
                Our online store is the best place to buy your favorite
                products. View available stock, make reservations, and enjoy
                exclusive deals on all groceries. Already have an account?
              </small>
              <Link to="/admin/login">
                <button
                  className="text-light border-0 text-uppercase outline-0 p-2 px-5 mt-3 rounded-pill small"
                  style={{
                    cursor: "pointer",
                    backgroundColor: "var(--secondary-dark)",
                  }}
                >
                  Login Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSignupPage;
