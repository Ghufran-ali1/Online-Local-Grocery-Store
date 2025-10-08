import React, { useContext, useEffect, useState } from "react";
import CategoriesTab from "../components/CategoriesTab";
import { CircularProgress, TablePagination } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { AdminContext } from "../AdminContext";
import AppBreadcrumbs from "../components/Breadcrumbs";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AdminView from "../components/AdminView";
import { Link, Navigate, useNavigate } from "react-router";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const options = [
  "Date (Newest first)",
  "Date (Oldest first)",
  "Alphabetical (A - Z)",
  "Alphabetical (Z - A)",
  "Stock Quantity (Less first)",
  "Stock Quantity (More first)",
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 500,
  bgcolor: "background.paper",
  boxShadow: 0,
  borderRadius: 4,
  p: 2,
};

const editStyle = {
  position: "absolute",
  top: "100px",
  left: "50%",
  transform: "translate(-50%)",
  bgcolor: "background.paper",
  boxShadow: 0,
  borderRadius: 4,
  p: 3,
};

const shortStkId = () => {
  const id = uuidv4();
  const hex = id.replace(/-/g, "");
  const first64Bits = hex.slice(0, 16);
  const value = BigInt("0x" + first64Bits);

  return `STK${value.toString().slice(0, 18)}`;
};

const getStatus = (date) => {
  const reservedDate = new Date(date);
  const today = new Date();

  // Strip time for both dates
  reservedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (reservedDate < today) {
    return (
      <span className="p-1 m-0 px-3 w-100 text-danger alert rounded-pill alert-danger">
        Overdue
      </span>
    );
  } else if (reservedDate > today) {
    return (
      <span className="p-1 m-0 px-3 w-100 text-success alert rounded-pill alert-success">
        Upcoming
      </span>
    );
  } else {
    return (
      <span className="p-1 m-0 px-3 w-100 text-primary alert rounded-pill alert-primary">
        Due Today
      </span>
    );
  }
};

function AdminPage() {
  const [page, setPage] = useState(0);
  const { adminDetails, isLoading } = useContext(AdminContext);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allCategories, setAllCategories] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [newItemArray, setNewItemArray] = useState([
    {
      name: "",
      category: "",
      description: "",
      quantity: 0,
      gallery: [],
      store_no: shortStkId(),
    },
  ]);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState({ state: false, store_no: null });
  const [openEdit, setOpenEdit] = useState({ state: false, store_no: null });
  const [editItemDetails, setEditItemDetails] = useState(null);
  const [editItemOriginalDetails, setEditItemOriginalDetails] = useState(null);
  const navigate = useNavigate();
  const messages = [
    "Checking credentials ...",
    "Verifying clearance ...",
    "Almost there ...",
    "Redirecting ...",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const openMenu = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        // stop incrementing once at the last message
        if (prevIndex < messages.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(messageInterval); // stop the interval
          return prevIndex; // stay at last index
        }
      });
    }, 1000);

    return () => clearInterval(messageInterval);
  }, [adminDetails]);

  useEffect(() => {
    if (!adminDetails) {
      const timer = setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [adminDetails, navigate]);

  useEffect(() => {
    fetch("https://grocery-store-server-theta.vercel.app/api/items")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        //
      });
    fetch("https://grocery-store-server-theta.vercel.app/api/admins")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setAllAdmins(data);
      })
      .catch((error) => {
        //
      });
  }, []);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (!items) return;

    let sorted = [...items];

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
        sorted = [...items];
        break;
    }

    setSortedItems(sorted);
  }, [selectedIndex, items]);

  useEffect(() => {
    setSortedItems(items?.slice().sort((a, b) => a.id - b.id) || []);
  }, [items]);

  const pagedItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  const handleAddItems = async () => {
    // Check if *all* items are still at their default/empty state
    const allEmpty = newItemArray.every(
      (item) =>
        !item.name.trim() &&
        !item.category.trim() &&
        !item.description.trim() &&
        item.quantity === 0 &&
        (!item.gallery || item.gallery.length === 0)
    );

    if (allEmpty) {
      alert("No items to add. Please fill at least one item.");
      return;
    }

    // Otherwise validate each item individually
    for (let i = 0; i < newItemArray.length; i++) {
      const item = newItemArray[i];
      if (
        !item.name.trim() ||
        !item.category.trim() ||
        !item.description.trim() ||
        item.quantity <= 0 ||
        !item.gallery ||
        item.gallery.length === 0
      ) {
        alert(`Fill all fields for item ${i + 1}`);
        return; // stop checking further
      }
    }

    document.getElementById("saveNewItemsBtn").disabled = true;
    document.getElementById("saveNewItemsBtn").innerText = "Saving ...";

    try {
      const response = await axios.post(
        "https://grocery-store-server-theta.vercel.app/api/create-items",
        newItemArray // send as array
      );

      const uploadedItems = response.data; // array of inserted items

      // Update local items state
      setItems((prev) => [...prev, ...uploadedItems]);

      setNewItemArray([
        {
          name: "",
          category: "",
          description: "",
          quantity: 0,
          gallery: [],
          store_no: shortStkId(),
        },
      ]);
      alert("Items added to database successfully!");
      document.getElementById("saveNewItemsBtn").disabled = false;
      document.getElementById("saveNewItemsBtn").innerText = "Save";
    } catch (err) {
      alert("Error uploading items.");
      document.getElementById("saveNewItemsBtn").disabled = false;
      document.getElementById("saveNewItemsBtn").innerText = "Save";
    }
  };

  const handleDeleteItem = async (store_no) => {
    document.getElementById("deleteBtn").disabled = true;
    document.getElementById("deleteBtn").innerText = "Deleting ...";
    try {
      const response = await axios.delete(
        `https://grocery-store-server-theta.vercel.app/api/delete-item`,
        { data: { id: store_no } }
      );
      if (response.status === 200) {
        setItems((prev) => prev.filter((item) => item.store_no !== store_no));
        setTimeout(() => {
          alert("Item deleted successfully!");
        }, 1000);
        setOpen({ state: false, store_no: null });
      }
    } catch (err) {
      setTimeout(() => {
        alert("Error deleting item. See console for details.");
      }, 1000);
    } finally {
      document.getElementById("deleteBtn").disabled = false;
      document.getElementById("deleteBtn").innerText = "Delete";
      setOpen({ state: false, store_no: null });
    }
  };

  const handleEditItem = async (store_no) => {
    const btn = document.getElementById("saveEditItemsBtn");
    btn.disabled = true;
    btn.innerText = "Saving ...";

    try {
      const { status, data } = await axios.put(
        "https://grocery-store-server-theta.vercel.app/api/update-item",
        editItemDetails
      );

      setItems((prev) =>
        prev?.map((item) =>
          item.store_no === store_no ? editItemDetails : item
        )
      );
      const msg = document.getElementById("editSuccess");

      // Any 2xx is success
      if (status >= 200 && status < 300) {
        msg.innerText = "✅ Item updated successfully!";
        msg.classList.add("text-success", "mb-2");

        // Close after 5 seconds
        setTimeout(() => {
          setOpenEdit({ state: false, store_no: null });
        }, 5000);
      }
    } catch (error) {
      msg.innerText =
        "❌ Error updating item." +
        (error?.response?.data?.message
          ? `(${error.response.data.message})`
          : "");
      msg.classList.add("text-danger", "mb-2");
    } finally {
      btn.disabled = false;
      btn.innerText = "Save Changes";
    }
  };

  useEffect(() => {
    fetch("https://grocery-store-server-theta.vercel.app/api/reservations")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => {
        setReservations([]);
        console.error("Error fetching reservations:", error);
      });
  }, []);

  return (
    <>
      <AppBreadcrumbs />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open.state}
        onClose={() => setOpen({ state: false, store_no: null })}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open.state}>
          <Box sx={style}>
            <h4>Delete Item</h4>
            <p>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="d-flex justify-content-end">
              <button
                id="deleteBtn"
                className="p-1 px-4 me-3 border border-danger outline-0 bg-danger text-white rounded-3 small"
                onClick={() => handleDeleteItem(open?.store_no)}
              >
                Delete
              </button>
              <button
                className="p-1 px-4 border border-black outline-0 bg-light text-dark rounded-3 small"
                onClick={() => setOpen({ state: false, store_no: null })}
              >
                Cancel
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEdit.state}
        onClose={() => setOpenEdit({ state: false, store_no: null })}
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
              <p className="m-0 p-0">{editItemDetails?.store_no}</p>
            </div>
            <div
              className="w-100 text-success text-center mb-2"
              id="editSuccess"
            ></div>
            {editItemDetails && (
              <div>
                {/* item details */}
                <div className="border position-relative rounded-3 mb-3 p-2 d-flex align-items-center flex-column flex-md-row gap-3">
                  <img
                    className="object-fit-cover object-position-center p-2"
                    width={250}
                    height={250}
                    src={editItemDetails?.gallery[0]}
                  />
                  <div className="w-100 p-1">
                    <table className="table adminStoreItemDetails table-sm">
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
                              style={{ boxShadow: "none" }}
                              className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                              type="text"
                              value={editItemDetails?.name}
                              onChange={(e) =>
                                setEditItemDetails({
                                  ...editItemDetails,
                                  name: e.target.value,
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
                            Category
                          </th>
                          <td>
                            <input
                              style={{ boxShadow: "none" }}
                              list="categories-edit"
                              id="category-edit"
                              className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                              type="text"
                              value={editItemDetails?.category}
                              onChange={(e) =>
                                setEditItemDetails({
                                  ...editItemDetails,
                                  category: e.target.value,
                                })
                              }
                            />

                            <datalist id={`categories-edit`}>
                              {allCategories?.map((cat) => (
                                <option key={cat} value={cat} />
                              ))}
                            </datalist>
                          </td>
                        </tr>
                        <tr>
                          <th
                            className="px-3"
                            scope="row"
                            style={{ textAlign: "right" }}
                          >
                            Description
                          </th>
                          <td>
                            <input
                              style={{ boxShadow: "none" }}
                              className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                              type="text"
                              value={editItemDetails?.description}
                              onChange={(e) =>
                                setEditItemDetails({
                                  ...editItemDetails,
                                  description: e.target.value,
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
                            Quantity
                          </th>
                          <td>
                            <input
                              style={{ boxShadow: "none" }}
                              className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                              type="number"
                              value={editItemDetails?.quantity}
                              onChange={(e) =>
                                setEditItemDetails({
                                  ...editItemDetails,
                                  quantity: e.target.value,
                                })
                              }
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-3 d-flex gap-3">
                  {editItemDetails?.gallery.length > 0 ? (
                    editItemDetails.gallery?.map((image, index) => (
                      <div
                        key={index}
                        className="position-relative border rounded-2"
                        style={{
                          display: "inline-block",
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <img
                          src={image}
                          alt={``}
                          className="img-fluid w-100 h-100 object-fit-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditItemDetails({
                              ...editItemDetails,
                              gallery: editItemDetails.gallery.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="btn-close position-absolute"
                          style={{ top: "5px", right: "5px" }}
                          aria-label="Close"
                        ></button>
                      </div>
                    ))
                  ) : (
                    <p>No images uploaded</p>
                  )}
                </div>
                {/* // gallery  */}
                <div className="mb-3">
                  <label className="form-label">Gallery/Images</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files); // all selected files
                      // Convert every file to a base64 string
                      Promise.all(
                        files?.map(
                          (file) =>
                            new Promise((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = (ev) => resolve(ev.target.result); // base64 string
                              reader.onerror = reject;
                              reader.readAsDataURL(file);
                            })
                        )
                      ).then((base64Images) => {
                        setEditItemDetails((prev) =>
                          // set to previous plus current
                          ({
                            ...prev,
                            gallery: [...(prev.gallery || []), ...base64Images],
                          })
                        );
                      });
                    }}
                  />
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <button
                id="saveEditItemsBtn"
                className="p-1 px-4 me-3 outline-0 rounded-3 small"
                onClick={() => handleEditItem(openEdit?.store_no)}
                disabled={
                  JSON.stringify(editItemDetails) ===
                  JSON.stringify(editItemOriginalDetails)
                }
                style={{
                  backgroundColor:
                    JSON.stringify(editItemDetails) ===
                    JSON.stringify(editItemOriginalDetails)
                      ? "var(--primary-light)"
                      : "var(--primary-color)",
                  border: "1px solid red",
                  cursor:
                    JSON.stringify(editItemDetails) ===
                    JSON.stringify(editItemOriginalDetails)
                      ? "not-allowed"
                      : "pointer",
                  color:
                    JSON.stringify(editItemDetails) ===
                    JSON.stringify(editItemOriginalDetails)
                      ? "red"
                      : "white",
                }}
              >
                Save Changes
              </button>
              <button
                className="p-1 px-4 border border-black outline-0 bg-light text-dark rounded-3 small"
                onClick={() => setOpenEdit({ state: false, store_no: null })}
              >
                Cancel
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>

      {isLoading ? (
        <div className="d-flex flex-column gap-3 justify-content-center align-items-center py-5 text-muted">
          <CircularProgress size={25} />
          Please wait ...
        </div>
      ) : adminDetails ? (
        <div className="container m-auto min-vh-100">
          {(adminDetails?.role === "Manager" ||
            adminDetails?.role === "Executive") && (
            <div className="border p-3 rounded-3 mb-3">
              <div className="d-flex justify-content-between gap-2 align-items-center">
                <h3 className="fw-bold">All Admins</h3>
                <span className="d-flex gap-2 align-items-center">
                  <i className="bi bi-person fs-5"></i> {allAdmins?.length || 0}{" "}
                  admins found
                </span>
              </div>

              <AdminView admins={allAdmins} />
            </div>
          )}

          <div className="border p-3 rounded-3 mb-3">
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <h3 className="fw-bold">All Categories</h3>
              <span className="d-flex gap-2 align-items-center">
                <i className="bi bi-cart-plus fs-5"></i>{" "}
                {allCategories.length || 0} categories found
              </span>
            </div>

            <CategoriesTab items={items} />
          </div>

          <div className="border p-3 rounded-3 mb-3">
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <h3 className="fw-bold">Reservations</h3>
              <span className="d-flex gap-2 align-items-center">
                <i className="bi bi-clock fs-5"></i> {reservations?.length || 0}{" "}
                items found
              </span>
            </div>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Reservation No.</th>
                    <th>Reserved by</th>
                    <th>Email</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Reserved On</th>
                    <th>For Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length > 0 ? (
                    reservations?.map((item, index) => (
                      <tr key={index}>
                        <th>{index + 1}.</th>
                        <td>{item.rsv_no}</td>
                        <td>{item.reserved_by}</td>
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {new Date(item.reserved_on)?.toLocaleDateString()}
                        </td>
                        <td>{new Date(item.date)?.toLocaleDateString()}</td>
                        <td>{getStatus(item.date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No reservations yet!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border p-3 rounded-3 mb-3">
            <div className="d-flex mb-3 justify-content-between gap-2 align-items-center">
              <h3 className="fw-bold">Store Items</h3>
              <div className="d-flex align-items-center gap-3">
                <span className="d-flex gap-2 align-items-center">
                  <i className="bi bi-cart-plus fs-5"></i> {items?.length || 0}{" "}
                  items found
                </span>
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
                  Sort by
                  <i className="bi bi-funnel fs-5"></i>
                </span>
              </div>
            </div>
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
                        index === selectedIndex ? "var(--primary-color)" : "",
                    }}
                  >
                    {option}
                  </div>
                </MenuItem>
              ))}
            </Menu>
            <div>
              {items?.length > 0 ? (
                <div>
                  {pagedItems?.map((item) => (
                    <div
                      key={item.id}
                      className="border position-relative rounded-3 mb-3 shadow p-2 d-flex align-items-center flex-column flex-md-row gap-3"
                    >
                      <div
                        className="position-absolute border-0 p-2 px-3 bg-transparent d-flex gap-2"
                        style={{
                          top: "10px",
                          right: "10px",
                        }}
                      >
                        <button
                          className=" border-0 p-2 px-3 bg-transparent d-flex gap-2"
                          onClick={() => {
                            setOpenEdit({
                              state: true,
                              store_no: item.store_no,
                            });
                            setEditItemDetails(item);
                            setEditItemOriginalDetails(item);
                          }}
                          title="Edit"
                          style={{
                            color: "var(--primary-color)",
                          }}
                        >
                          Edit <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className=" border-0 p-2 px-3 bg-transparent d-flex gap-2"
                          onClick={() =>
                            setOpen({ state: true, store_no: item.store_no })
                          }
                          title="Edit"
                          style={{
                            color: "red",
                          }}
                        >
                          Delete <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <Link
                        className="hoverBorder"
                        href={`/store/${item?.category}/${item?.store_no}`}
                        target="_blank"
                      >
                        <img
                          className="object-fit-cover object-position-center p-2"
                          width={250}
                          height={250}
                          src={item.gallery[0]}
                        />
                      </Link>
                      <div className="w-100 p-1">
                        <table className="table adminStoreItemDetails table-sm">
                          <tbody>
                            <tr>
                              <th
                                className="px-3"
                                scope="row"
                                style={{ textAlign: "right", width: "20%" }}
                              >
                                ID
                              </th>
                              <td>{item.id}</td>
                            </tr>
                            <tr>
                              <th
                                className="px-3"
                                scope="row"
                                style={{ textAlign: "right" }}
                              >
                                Name
                              </th>
                              <td>{item.name}</td>
                            </tr>
                            <tr>
                              <th
                                className="px-3"
                                scope="row"
                                style={{ textAlign: "right" }}
                              >
                                Category
                              </th>
                              <td>{item.category}</td>
                            </tr>
                            <tr>
                              <th
                                className="px-3"
                                scope="row"
                                style={{ textAlign: "right" }}
                              >
                                Description
                              </th>
                              <td>{item.description}</td>
                            </tr>
                            <tr>
                              <th
                                className="px-3"
                                scope="row"
                                style={{ textAlign: "right" }}
                              >
                                Quantity
                              </th>
                              <td>{item.quantity}</td>
                            </tr>
                            <tr>
                              <th
                                className="px-3"
                                scope="row"
                                style={{ textAlign: "right" }}
                              >
                                Store No.
                              </th>
                              <td>{item.store_no}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  Preparing Items ...
                </div>
              )}
              <TablePagination
                count={items?.length || 0}
                component="div"
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>

          <div className="border p-3 rounded-3 mb-3">
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <h3 className="fw-bold">New Items</h3>
              <span className="d-flex gap-2 align-items-center">
                <i className="bi bi-cart-plus fs-5"></i> 27 items found
              </span>
            </div>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Gallery/Images</th>
                  </tr>
                </thead>
                <tbody>
                  {newItemArray.length > 0 &&
                    newItemArray?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td>
                          <input
                            style={{ boxShadow: "none" }}
                            className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                            value={item.name}
                            placeholder="Enter name"
                            type="text"
                            onChange={(e) =>
                              setNewItemArray((prev) =>
                                prev.map((it, i) =>
                                  i === index
                                    ? { ...it, name: e.target.value }
                                    : it
                                )
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            style={{ boxShadow: "none" }}
                            className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                            value={item.category}
                            placeholder="Enter category"
                            id={`category${index}`}
                            list={`categories${index}`}
                            type="text"
                            onChange={(e) =>
                              setNewItemArray((prev) =>
                                prev.map((it, i) =>
                                  i === index
                                    ? { ...it, category: e.target.value }
                                    : it
                                )
                              )
                            }
                          />

                          <datalist id={`categories${index}`}>
                            {allCategories?.map((cat) => (
                              <option key={cat} value={cat} />
                            ))}
                          </datalist>
                        </td>

                        <td>
                          <input
                            style={{ boxShadow: "none" }}
                            className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                            value={item.description} // ✅ fixed typo
                            placeholder="Enter description"
                            type="text"
                            onChange={(e) =>
                              setNewItemArray((prev) =>
                                prev.map((it, i) =>
                                  i === index
                                    ? { ...it, description: e.target.value }
                                    : it
                                )
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            style={{ boxShadow: "none" }}
                            className="form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0"
                            value={item.quantity}
                            placeholder="Enter quantity"
                            type="number"
                            onChange={(e) =>
                              setNewItemArray((prev) =>
                                prev.map((it, i) =>
                                  i === index
                                    ? {
                                        ...it,
                                        quantity: Number(e.target.value),
                                      }
                                    : it
                                )
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            style={{ boxShadow: "none" }}
                            className="form-control small m-0 outline-0"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files); // all selected files
                              // Convert every file to a base64 string
                              Promise.all(
                                files?.map(
                                  (file) =>
                                    new Promise((resolve, reject) => {
                                      const reader = new FileReader();
                                      reader.onload = (ev) =>
                                        resolve(ev.target.result); // base64 string
                                      reader.onerror = reject;
                                      reader.readAsDataURL(file);
                                    })
                                )
                              ).then((base64Images) => {
                                setNewItemArray((prev) =>
                                  prev?.map((it, i) =>
                                    i === index
                                      ? { ...it, gallery: base64Images }
                                      : it
                                  )
                                );
                              });
                            }}
                          />
                        </td>
                      </tr>
                    ))}

                  {/* <tr>
                <td>1</td>
                <td><input style={{boxShadow: 'none'}} className='form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0' placeholder='Enter name' type='text' /></td>
                <td><input style={{boxShadow: 'none'}} className='form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0' placeholder='Enter category' type='text' /></td>
                <td><input style={{boxShadow: 'none'}} className='form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0' placeholder='Enter description' type='text' /></td>
                <td><input style={{boxShadow: 'none'}} className='form-control p-1 px-2 small m-0 border-black rounded-0 border-bottom w-100 border-0 outline-0' placeholder='Enter quantity' type='number' /></td>
                <td><input style={{boxShadow: 'none'}} className='form-control small m-0 outline-0' type='file' multiple /></td>
              </tr> */}
                  <tr>
                    <td className="border" colSpan={6}>
                      <button
                        onClick={() =>
                          setNewItemArray((prev) => [
                            ...prev,
                            {
                              name: "",
                              category: "",
                              description: "",
                              quantity: 0,
                              gallery: [],
                              store_no: shortStkId(),
                            },
                          ])
                        }
                        className="d-flex gap-2 border-0 outline-0 bg-transparent align-items-center"
                      >
                        <i className="bi bi-plus-circle"></i>Add another
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={6}>
                      <div className="d-flex w-100 gap-4 justify-content-end">
                        <button
                          className="d-flex gap-2 border-0 outline-0 bg-transparent align-items-center text-danger"
                          onClick={() =>
                            setNewItemArray([
                              {
                                name: "",
                                category: "",
                                description: "",
                                quantity: 0,
                                gallery: [],
                                store_no: shortStkId(),
                              },
                            ])
                          }
                        >
                          <i className="bi bi-x-circle"></i> Cancel
                        </button>
                        <button
                          onClick={handleAddItems}
                          id="saveNewItemsBtn"
                          className="d-flex gap-2 border-0 outline-0 bg-transparent align-items-center text-success"
                        >
                          <i className="bi bi-check-circle"></i>Save
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 justify-content-center align-items-center py-5 text-muted">
          <CircularProgress size={25} />
          {messages[currentMessageIndex]}
        </div>
      )}
    </>
  );
}

export default AdminPage;
