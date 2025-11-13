import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Password } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "var(--background-light)",
  borderRadius: 4,
  p: 2,
  width: 500,
};

const editStyle = {
  position: "absolute",
  top: "100px",
  left: "50%",
  transform: "translate(-50%)",
  bgcolor: "var(--background-color)",
  boxShadow: 0,
  borderRadius: 4,
  p: 3,
};

function AdminView({ admins, setAllAdmins }) {
  const containerRef = useRef();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeAdmin, setActiveAdmin] = useState(null);
  const [openEdit, setOpenEdit] = useState({ state: false, id: null });
  const [editItemDetails, setEditItemDetails] = useState(null);
  const [editItemOriginalDetails, setEditItemOriginalDetails] = useState(null);
  const [theme, setTheme] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [isAdminChanged, setIsAdminChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    const listener = () => {
      // invert theme to get the new current value
      setTheme(localStorage.getItem("theme") === "light" ? "dark" : "light");
    };
    window.addEventListener("themeChanged", listener);
    return () => window.removeEventListener("themeChanged", listener);
  }, []);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < maxScrollLeft - 5); // `-5` for precision
  };

  // Recheck on manual scroll or resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll(); // Initial check

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Function to scroll the container
  const scroll = (direction) => {
    const container = containerRef.current;
    const itemWidth = container.offsetWidth;

    // Scroll the container by one item width
    container.scrollBy({ left: direction * itemWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const firstItem = container.querySelector(".Item");
    if (!firstItem) return;

    let itemWidth =
      firstItem.offsetWidth +
      parseFloat(getComputedStyle(firstItem).marginRight || 0);
    let currentIndex = 0;

    const scrollOneItem = () => {
      if (!container) return;

      const maxIndex =
        Math.floor(container.scrollWidth / itemWidth) -
        Math.floor(container.offsetWidth / itemWidth);

      if (currentIndex >= maxIndex) {
        currentIndex = 0;
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        currentIndex++;
        container.scrollTo({
          left: currentIndex * itemWidth,
          behavior: "smooth",
        });
      }
    };

    const intervalId = setInterval(scrollOneItem, 5000);

    // Optional: Listen to window resize to remeasure item width
    const handleResize = () => {
      const newFirstItem = container.querySelector(".Item");
      if (newFirstItem) {
        itemWidth =
          newFirstItem.offsetWidth +
          parseFloat(getComputedStyle(newFirstItem).marginRight || 0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleEditItem = async () => {
    const btn = document.getElementById("saveEditAdminBtn");
    const msg = document.getElementById("editAdminSuccess");
    setPasswordError(false);
    setOldPasswordError(false);
    msg.innerText = "";

    if (newPassword.trim() !== "" || confirmNewPassword.trim() !== "") {
      // If all password fields are empty, consider it as no change
      if (newPassword !== confirmNewPassword) {
        setPasswordError(true);
        return;
      } else {
        setPasswordError(false);
      }
      if (oldPassword !== editItemOriginalDetails.password) {
        setOldPasswordError(true);
        return;
      } else {
        setOldPasswordError(false);
      }

      if (newPassword == oldPassword) {
        msg.innerText = "❌ New password cannot be the same as old password!";

        msg.classList.add("text-danger", "mb-2");
        msg.classList.remove("text-success");
        return;
      }
    }

    btn.disabled = true;
    btn.innerText = "Updating ...";

    try {
      const { status, data } = await axios.put(
        "https://grocery-store-server-theta.vercel.app/api/update-admin",
        editItemDetails
      );

      // Any 2xx is success
      if (status >= 200 && status < 300) {
        msg.innerText = "✅ Item updated successfully!";
        msg.classList.add("text-success", "mb-2");
        msg.classList.remove("text-danger");

        // Update admin in parent state
        setAllAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === editItemDetails.id ? editItemDetails : admin
          )
        );

        // Close after 5 seconds
        setTimeout(() => {
          setOpenEdit({ state: false, id: null });
          setEditItemDetails(null);
          setEditItemOriginalDetails(null);
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        }, 5000);
      }
    } catch (error) {
      msg.innerText =
        "❌ Error updating admin. Please try again later of contact developer!" +
        (error?.response?.data?.message
          ? `(${error.response.data.message})`
          : "");
      msg.classList.add("text-danger", "mb-2");
      msg.classList.remove("text-success");
      console.error("Error updating admin:", error);

      btn.innerText = "Try Again ...";
    } finally {
      btn.disabled = false;
      btn.innerText = "Save Changes";
    }
  };

  useEffect(() => {
    const isChanged =
      JSON.stringify(editItemDetails) !==
        JSON.stringify(editItemOriginalDetails) ||
      newPassword !== "" ||
      confirmNewPassword !== "";
    setIsAdminChanged(isChanged);
  }, [
    editItemDetails,
    editItemOriginalDetails,
    newPassword,
    confirmNewPassword,
  ]);

  const handleDeleteAdmin = (id) => async () => {
    const btn = document.getElementById("deleteAdminBtn");
    const msg = document.getElementById("deleteAdminSuccess");
    btn.disabled = true;
    btn.innerText = "Deleting ...";

    console.log("Deleting admin with ID:", id);

    try {
      const { status, data } = await axios.delete(
        `https://grocery-store-server-theta.vercel.app/api/delete-admin`,
        {
          data: { id },
        }
      );
      // Any 2xx is success
      if (status >= 200 && status < 300) {
        msg.innerText = "✅ Admin deleted successfully!";
        msg.classList.add("text-success", "mb-2");
        msg.classList.remove("text-danger");
        // Remove admin in parent state
        setAllAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== id)
        );
        // Close
        setOpenEdit({ state: false, id: null });
      }
    } catch (error) {
      msg.innerText =
        "❌ Error deleting admin. Please try again later of contact developer!" +
        (error?.response?.data?.message
          ? `(${error.response.data.message})`
          : "");
      msg.classList.add("text-danger", "mb-2");
      msg.classList.remove("text-success");
      console.error("Error deleting admin:", error);

      btn.innerText = "Try Again ...";
    } finally {
      btn.disabled = false;
      btn.innerText = "Delete Admin";
    }
  };

  function ChildModal({ id }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <React.Fragment>
        <div className="mb-3">
          <button
            type="button"
            id="deleteAdminBtn"
            onClick={handleOpen}
            className="p-1 px-4 me-3 outline-0 rounded-3 small"
            style={{
              outline: "none",
              backgroundColor: "transparent",
              border: "1px solid red",
              cursor: "pointer",
              color: "red",
            }}
          >
            Delete Admin
          </button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style }}>
            <h4 id="child-modal-title" className="text-danger">
              Delete
            </h4>
            <p id="child-modal-description">
              Are you sure you want to delete this admin? This action cannot be
              undone and you will not be able to retrieve this account.
            </p>
            <div className="mb-3 d-flex gap-2 justify-content-end">
              <button
                type="button"
                id="deleteAdminBtn"
                onClick={handleClose}
                className="p-1 px-4 me-3 outline-0 rounded-3 small"
                style={{
                  outline: "none",
                  backgroundColor: "transparent",
                  border: "1px solid var(--text-light)",
                  cursor: "pointer",
                  color: "var(--text-light)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                id="deleteAdminBtn"
                onClick={handleDeleteAdmin(id)}
                className="p-1 px-4 me-3 outline-0 rounded-3 small"
                style={{
                  outline: "none",
                  backgroundColor: "transparent",
                  border: "1px solid red",
                  cursor: "pointer",
                  color: "red",
                }}
              >
                Continue
              </button>
            </div>

            <div
              className="w-100 text-success text-center mb-2 small"
              id="deleteAdminSuccess"
            ></div>
          </Box>
        </Modal>
      </React.Fragment>
    );
  }

  return (
    <>
      <div className="position-relative p-2 py-3 mb-2 mt-2 container">
        {canScrollPrev && (
          <button
            className="carousel-nav shadow carousel-prev"
            onClick={() => scroll(-1)}
          >
            <ChevronLeft />
          </button>
        )}
        <div
          ref={containerRef}
          className="position-relative mt-2 mb-3 d-flex gap-4 overflow-auto justify-content-start"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            scrollBehavior: "smooth",
          }}
        >
          {admins.map((admin, index) => (
            <div
              key={admin.id || index}
              className="Item"
              style={{
                scrollSnapAlign: "start",
                minWidth: "200px",
                flexShrink: 0,
              }}
            >
              <Avatar
                className="mb-2 m-auto"
                alt={admin.name}
                src={admin.avatar}
                style={{ width: "100px", height: "100px" }}
              />
              <div className="text-center fw-semibold fs-6">
                {index + 1}. {admin.username}
              </div>
              <div className="text-center">{admin.email}</div>
              <div className="text-center small text-muted">
                <Link
                  to={`#`}
                  onClick={() => {
                    setOpenEdit({
                      state: true,
                      id: admin.id,
                    });
                    setEditItemDetails(admin);
                    setEditItemOriginalDetails(admin);
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        {canScrollNext && (
          <button
            className="carousel-nav shadow carousel-next"
            onClick={() => scroll(1)}
          >
            <ChevronRight />
          </button>
        )}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEdit.state}
        onClose={() => setOpenEdit({ state: false, id: null })}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEdit.state}>
          <Box sx={editStyle} className="container">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h4>Edit Item</h4>
              <p className="m-0 p-0">{editItemDetails?.id}</p>
            </div>
            <div
              className="w-100 editAdminSuccess text-success text-center mb-2"
              id="editAdminSuccess"
            ></div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
                handleEditItem();
              }}
            >
              {editItemDetails && (
                <div>
                  {/* item details */}
                  <div
                    className="position-relative rounded-3 mb-3 p-2 py-4 d-flex align-items-start flex-column flex-md-row gap-3"
                    style={{ border: "1px solid var(--text-light)" }}
                  >
                    <Avatar
                      className="mb-2 border"
                      alt={editItemDetails.name}
                      src={editItemDetails.avatar}
                      style={{ width: "200px", height: "200px" }}
                    />
                    <div className="w-100 p-1">
                      <table
                        className={`table  adminStoreItemDetails table-sm ${
                          theme === "dark" ? "table-dark" : ""
                        }`}
                      >
                        <tbody>
                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right", width: "20%" }}
                            >
                              ID
                            </th>
                            <td>{editItemDetails?.id}</td>
                          </tr>
                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right" }}
                            >
                              Name
                            </th>
                            <td>
                              <input
                                style={{
                                  boxShadow: "none",
                                  color: "var(--text-color)",
                                }}
                                className="form-control bg-transparent p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                                type="text"
                                value={editItemDetails?.username}
                                onChange={(e) =>
                                  setEditItemDetails({
                                    ...editItemDetails,
                                    username: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right" }}
                            >
                              Email
                            </th>
                            <td>
                              <input
                                style={{
                                  boxShadow: "none",
                                  color: "var(--text-color)",
                                }}
                                className="form-control bg-transparent p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                                type="text"
                                value={editItemDetails?.email}
                                onChange={(e) =>
                                  setEditItemDetails({
                                    ...editItemDetails,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right" }}
                            >
                              Role
                            </th>
                            <td>
                              <select
                                style={{
                                  boxShadow: "none",
                                  color: "var(--text-color)",
                                }}
                                className="form-control bg-transparent p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                                type="text"
                                value={editItemDetails?.role}
                                onChange={(e) =>
                                  setEditItemDetails({
                                    ...editItemDetails,
                                    role: e.target.value,
                                  })
                                }
                              >
                                <option value={""}>Select Role</option>
                                <option
                                  className="text-black"
                                  value="Executive"
                                >
                                  Executive
                                </option>
                                <option className="text-black" value="Manager">
                                  Manager
                                </option>
                                <option className="text-black" value="Staff">
                                  Staff
                                </option>
                              </select>
                            </td>
                          </tr>

                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right" }}
                            >
                              Old Password
                            </th>
                            <td>
                              <input
                                style={{
                                  boxShadow: "none",
                                  color: "var(--text-color)",
                                }}
                                className="form-control bg-transparent p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                                type={showPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />

                              {oldPasswordError && (
                                <div
                                  className="w-100 editAdminSuccess px-2 text-danger text-left small mb-2"
                                  id="editAdminSuccess"
                                >
                                  ❌ You have entered an incorrect password!{" "}
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right" }}
                            >
                              New Password
                            </th>
                            <td>
                              <input
                                style={{
                                  boxShadow: "none",
                                  color: "var(--text-color)",
                                }}
                                className="form-control bg-transparent p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                placeholder="Not changed"
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="px-3"
                              scope="row"
                              style={{ textAlign: "right" }}
                            >
                              Confirm New Password
                            </th>
                            <td>
                              <input
                                style={{
                                  boxShadow: "none",
                                  color: "var(--text-color)",
                                }}
                                className="form-control bg-transparent p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                                type={showPassword ? "text" : "password"}
                                value={confirmNewPassword}
                                placeholder="Not changed"
                                onChange={(e) =>
                                  setConfirmNewPassword(e.target.value)
                                }
                              />

                              {passwordError && (
                                <div
                                  className="w-100 editAdminSuccess px-2 text-danger text-left small mb-2"
                                  id="editAdminSuccess"
                                >
                                  ❌ Passwords do not match!{" "}
                                </div>
                              )}
                              <div className="px-2 small">
                                <FormControlLabel
                                  sx={{
                                    fontSize: "small",
                                  }}
                                  control={
                                    <Checkbox
                                      sx={{
                                        color: "var(--text-color)",
                                        fontSize: "small",
                                        "&.Mui-checked": {
                                          color: "var(--primary-color)",
                                        },
                                      }}
                                      checked={showPassword}
                                      onChange={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    />
                                  }
                                  label="Show Password"
                                />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* // avatar  */}
                  <div className="mb-3">
                    <label className="form-label">Select Avatar</label>
                    <input
                      type="file"
                      className="form-control bg-transparent"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setEditItemDetails((prev) => ({
                            ...prev,
                            avatar: ev.target.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <p className="fw-semibold text-danger">Delete Admin</p>
                    <p>
                      Deleting an admin is a permanent action and cannot be
                      undone. Please proceed with caution.
                    </p>

                    <ChildModal id={editItemDetails.id} />
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button
                  id="saveEditAdminBtn"
                  className="p-1 px-4 me-3 outline-0 rounded-3 small"
                  disabled={!isAdminChanged}
                  style={{
                    outline: "none",
                    backgroundColor: !isAdminChanged
                      ? "transparent"
                      : "var(--primary-color)",
                    border: !isAdminChanged
                      ? "1px solid red"
                      : "1px solid var(--primary-color)",
                    cursor: !isAdminChanged ? "not-allowed" : "pointer",
                    color: !isAdminChanged ? "red" : "white",
                  }}
                >
                  Save Changes
                </button>
                <button
                  className="p-1 px-4 border-0 outline-0 bg-dark text-light rounded-3 small"
                  onClick={() => setOpenEdit({ state: false, id: null })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default AdminView;
