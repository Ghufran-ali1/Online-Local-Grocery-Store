import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AdminContext } from "../context/AdminContext";
import AppBreadcrumbs from "../components/Breadcrumbs";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Test User");
  const [password, setPassword] = useState("123456789");
  const [message, setMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const { setAdminDetails } = useContext(AdminContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoggingIn(true);

    if (username.trim() === "" || password.trim() === "") {
      setMessage("Please fill in all the required fields.");
      setLoggingIn(false);
      return;
    }
    try {
      const response = await fetch(
        `https://grocery-store-server-theta.vercel.app/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Login successful: " + data.message);
        
        setAdminDetails(data.user);
        localStorage.setItem("admin_auth_token", data.token);
        setLoggingIn(false);

        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        // Handle login error
        setMessage("Login failed: " + data.message);
        setLoggingIn(false);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      setLoggingIn(false);
    }
  };
  return (
    <>
      <AppBreadcrumbs />
      <div className="container m-auto pb-3">
        <div className="border p-3 rounded-3 mb-3">
          <h3 className="fw-semibold">LOGIN</h3>

          <div className="d-flex flex-column-reverse flex-lg-row gap-3">
            <div className="w-100 d-flex justify-content-center align-items-center flex-column text-center p-3 gap-2">
              <h3>Signup</h3>
              <small>
                Our online store is the best place to buy your favorite
                products. View available stock, make reservations, and enjoy
                exclusive deals on all groceries. Don't have an account?
              </small>
              <Link to="/admin/signup">
                <button
                  className="text-light border-0 text-uppercase outline-0 p-2 px-5 mt-3 rounded-pill small"
                  style={{
                    cursor: "pointer",
                    backgroundColor: "var(--secondary-dark)",
                  }}
                >
                  Signup Now
                </button>
              </Link>
            </div>
            <div className="w-100 py-4">
              <form
                onSubmit={(e) => handleLogin(e)}
                className="d-flex flex-column gap-2"
              >
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  <label htmlFor="password">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  type="submit"
                  className="text-light small border-0 outline-0 p-2 w-100 mt-3 rounded-pill"
                  style={{
                    cursor: "pointer",
                    backgroundColor: "var(--secondary-dark)",
                  }}
                >
                  {loggingIn ? "Logging in ..." : "Login Now"}{" "}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLoginPage;
