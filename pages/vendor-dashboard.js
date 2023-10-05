import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import BestSellerSlider from "../components/sliders/BestSeller";
import Pagination from "../components/ecommerce/Pagination";
import QuickView from "../components/ecommerce/QuickView";
import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
import SingleProduct from "../components/ecommerce/SingleProduct";
import SortSelect from "../components/ecommerce/Filter/SortSelect";
import WishlistModal from "../components/ecommerce/WishlistModal";
import Layout from "../components/layout/Layout";
import { fetchProduct } from "../redux/action/product";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import Link from "next/link";

// icons
import { BsFillTrashFill } from "react-icons/bs";
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowDropdown,
  IoIosArrowDropupCircle,
} from "react-icons/io";

const ProductsFullWidth = ({
  products,
  productFilters,
  fetchProduct,
  cartItems,
}) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  // const [orders, setOrders] = useState([]);
  const [orders, setOrders] = useState(null);
  const { data: session } = useSession();
  const [sortDate, setSortDate] = useState(true);
  const [sortStatus, setSortStatus] = useState(true);
  const [searchOrder, setSearchOrder] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [todaySales, setTodaySales] = useState({ profit: 0, orders: 0 });
  const [thisWeekSales, setThisWeekSales] = useState({ profit: 0, orders: 0 });
  const [thisMonthSales, setThisMonthSales] = useState({
    profit: 0,
    orders: 0,
  });
  const [thisYearSales, setThisYearSales] = useState({ profit: 0, orders: 0 });
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  console.log(products);

  let Router = useRouter(),
    searchTerm = Router.query.search,
    showLimit = 12,
    showPagination = 4;

  let [pagination, setPagination] = useState([]);
  let [limit, setLimit] = useState(showLimit);
  let [pages, setPages] = useState(Math.ceil(products.items.length / limit));
  let [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProduct(searchTerm, "/api/medicine", productFilters);
    cratePagination();
  }, [productFilters, limit, pages, products.items.length]);
  useEffect(() => {
    if (!session) {
      Router.push("/page-login");
    } else if (session.user.role === "customer") {
      Router.push("/");
    } else if (session.user.role === "vendor") {
      getOrders();
    }
  }, [session]);

  const getOrders = async () => {
    try {
      const res = await fetch(`/api/order`);
      const data = await res.json();
      setOrders(data.data);
      const currentDate = new Date();
      const currentWeekStart = new Date(currentDate);
      currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week
      const currentMonthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Start of the current month
      let todaySales = 0;
      let thisWeekSales = 0;
      let thisMonthSales = 0;
      let thisYearSales = 0;

      let todayProfit = 0;
      let todayOrders = 0;
      let thisWeekProfit = 0;
      let thisWeekOrders = 0;
      let thisMonthProfit = 0;
      let thisMonthOrders = 0;
      let thisYearProfit = 0;
      let thisYearOrders = 0;

      data.data.forEach((order) => {
        const orderDate = new Date(order.date);

        if (orderDate.toDateString() === currentDate.toDateString()) {
          todayProfit += parseFloat(order.profit);
          todaySales += parseFloat(order.totalAmount);
          todayOrders++;
        }

        if (orderDate >= currentWeekStart) {
          thisWeekSales += parseFloat(order.totalAmount);
          thisWeekProfit += parseFloat(order.profit);
          thisWeekOrders++;
        }

        if (orderDate >= currentMonthStart) {
          thisMonthSales += parseFloat(order.totalAmount);
          thisMonthProfit += parseFloat(order.profit);
          thisMonthOrders++;
        }
        if (orderDate.getFullYear() === currentDate.getFullYear()) {
          thisYearSales += parseFloat(order.totalAmount);
          thisYearProfit += parseFloat(order.profit);
          thisYearOrders++;
        }
      });

      setTodaySales({
        profit: todayProfit.toFixed(2),
        orders: todayOrders,
        sales: todaySales.toFixed(2),
      });
      setThisWeekSales({
        profit: thisWeekProfit.toFixed(2),
        orders: thisWeekOrders,
        sales: thisWeekSales.toFixed(2),
      });
      setThisMonthSales({
        profit: thisMonthProfit.toFixed(2),
        orders: thisMonthOrders,
        sales: thisMonthSales.toFixed(2),
      });
      setThisYearSales({
        profit: thisYearProfit.toFixed(2),
        orders: thisYearOrders,
        sales: thisYearSales.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const cratePagination = () => {
    // set pagination
    let arr = new Array(Math.ceil(products.items.length / limit))
      .fill()
      .map((_, idx) => idx + 1);

    setPagination(arr);
    setPages(Math.ceil(products.items.length / limit));
  };

  const startIndex = currentPage * limit - limit;
  const endIndex = startIndex + limit;
  const getPaginatedProducts = products.items.slice(startIndex, endIndex);

  let start = Math.floor((currentPage - 1) / showPagination) * showPagination;
  let end = start + showPagination;
  const getPaginationGroup = pagination.slice(start, end);

  const next = () => {
    setCurrentPage((page) => page + 1);
  };

  const prev = () => {
    setCurrentPage((page) => page - 1);
  };

  const handleActive = (item) => {
    setCurrentPage(item);
  };

  const selectChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
    setPages(Math.ceil(products.items.length / Number(e.target.value)));
  };

  // sorting
  const handleSortDate = () => {
    orders.sort((a, b) => {
      if (sortDate) {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
    setSortDate(!sortDate);
  };
  const handleSortStatus = () => {
    if (!sortStatus) {
      setSortStatus(true);
      setSortDate(true);
    } else {
      setSortStatus(false);
      setSortDate(false);
    }
  };

  const handleToggleOrderDetails = (e, order) => {
    e.preventDefault();
    if (currentOrder === order) {
      setCurrentOrder(null); // Deselect the order if it's already selected
    } else {
      setCurrentOrder(order); // Select the order if it's not selected
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Delete order
  const handleDelete = async (e, orderId) => {
    e.preventDefault();

    // Show a confirmation dialog to the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) {
      return; // User canceled the deletion
    }

    try {
      const response = await fetch(`/api/order/delete?orderId=${orderId}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        // Order deleted successfully
        toast.success("Order deleted successfully");
        getOrders();
        // You can perform any additional actions here, such as updating the UI.
      } else if (response.status === 404) {
        // Order not found
        toast.error("Order not found");
      } else {
        // Other errors
        toast.error("Error deleting order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };
  const handleMedicineDelete = async (id) => {
    // Display a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmed) {
      // If the user cancels the confirmation, do nothing
      return;
    }

    try {
      const res = await fetch(`/api/medicine/delete?medicineId=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Medicine Deleted");
      fetchProduct(searchTerm, "/api/medicine", productFilters);
      cratePagination();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchOrder(searchTerm);

    if (searchTerm === "") {
      // If the search term is empty, reset the filtered orders to the original orders
      setFilteredOrders(null);
    } else {
      // Filter the orders based on the search term
      //ignore case
      const filtered = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };
  useEffect(() => {
    // Update the filtered orders whenever the original orders change
    if (searchOrder === "") {
      setFilteredOrders(null); // Reset the filtered orders
    } else {
      // Filter the orders based on the search term
      const filtered = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchOrder.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchOrder]);
  const handleCancelClick = async (e, orderId) => {
    try {
      // Show a confirmation dialog to confirm the cancellation
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (!confirmed) {
        // User canceled the action, do nothing
        return;
      }

      // Make a PUT request to the API endpoint to cancel the order
      const response = await fetch(`/api/order/cancel/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (response.ok) {
        // Order was successfully canceled, you can update your UI or show a message here
        toast.success("Order was canceled successfully");
        console.log("Order was canceled successfully");
        getOrders();
      } else {
        // Handle any error or display an error message
        const data = await response.json();
        toast.error(data.error);
        console.error("Failed to cancel the order:", data.error);
      }
    } catch (error) {
      toast.error("An error occurred while canceling the order");
      console.error("An error occurred while canceling the order:", error);
    }
  };
  const handleUndoClick = async (e, orderId) => {
    try {
      // Show a confirmation dialog to confirm the cancellation
      const confirmed = window.confirm(
        "Are you sure you want to restore this order?"
      );

      if (!confirmed) {
        // User canceled the action, do nothing
        return;
      }

      // Make a PUT request to the API endpoint to cancel the order
      const response = await fetch(`/api/order/cancel/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "undo" }),
      });

      if (response.ok) {
        // Order was successfully canceled, you can update your UI or show a message here
        toast.success("Order was restored successfully");

        getOrders();
      } else {
        // Handle any error or display an error message
        const data = await response.json();
        toast.error(data.error);
        console.error("Failed to undo the order:", data.error);
      }
    } catch (error) {
      toast.error("An error occurred while canceling the order");
      console.error("An error occurred while canceling the order:", error);
    }
  };
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    console.log(filter);
    setSelectedStatus(filter);
    if (filter === "") {
      // If the filter is empty, reset the filtered orders to the original orders
      setFilteredOrders(null);
    } else {
      // Filter the orders based on the filter
      const filtered = orders.filter((order) => {
        if (filter === "pending") {
          return !order.cancelled && !order.status;
        } else if (filter === "delivered") {
          return order.status;
        } else if (filter === "cancelled") {
          return order.cancelled;
        }
      });

      setFilteredOrders(filtered);
    }
  };
  const handleUpdateStatusClick = async (e, orderId) => {
    try {
      // Show a confirmation dialog to confirm the cancellation
      const confirmed = window.confirm(
        "Are you sure you want to mark this order as delivered?"
      );

      if (!confirmed) {
        // User canceled the action, do nothing
        return;
      }

      // Make a PUT request to the API endpoint to cancel the order
      const response = await fetch(`/api/order/deliver/${orderId}`, {
        method: "PUT",
      });

      if (response.ok) {
        // Order was successfully canceled, you can update your UI or show a message here
        toast.success("Order was marked as delivered successfully");

        getOrders();
      } else {
        // Handle any error or display an error message
        const data = await response.json();
        toast.error(data.error);
        console.error("Failed to mark the order as delivered:", data.error);
      }
    } catch (error) {
      toast.error("An error occurred while marking the order as delivered");
      console.error(
        "An error occurred while marking the order as delivered:",
        error
      );
    }
  };
  return (
    <>
      <Layout parent="Home" sub="Vendor  " subChild="Dashboard">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="display-2 mt-30 pb-30">Dashboard</h1>
                <hr className="mb-80" />
                <div className="row">
                  <div className="col-lg-9">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h3 className="mb-30">Recent Orders</h3>
                      <Link
                        className="btn btn-fill-out hover: font-weight-bold"
                        href={"/add-item"}
                      >
                        Add Medicine
                      </Link>
                    </div>
                    <div className="table-responsive">
                      <div className="input-group d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                          <input
                            type="search"
                            className="form-control"
                            placeholder="Search Orders"
                            aria-label="Search Orders"
                            aria-describedby="basic-addon2"
                            // value={searchOrder}
                            onChange={handleSearchChange}
                          />
                        </div>
                        {/* add filters for pending, delivered and cancelled orders */}
                        <div className="input-group-append">
                          <select
                            className="form-select"
                            onChange={handleFilterChange}
                          >
                            <option value="">All Orders</option>
                            <option value="pending">Pending Orders</option>
                            <option value="delivered">Delivered Orders</option>
                            <option value="cancelled">Cancelled Orders</option>
                          </select>
                        </div>
                      </div>
                      <br />
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Order</th>
                            <th onClick={handleSortDate}>
                              Date
                              {!sortDate && <IoIosArrowUp />}
                              {sortDate && <IoIosArrowDown />}
                            </th>
                            <th onClick={handleSortStatus}>
                              Status
                              {sortStatus && <IoIosArrowUp />}
                              {!sortStatus && <IoIosArrowDown />}
                            </th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(filteredOrders || orders)?.length === 0 ? (
                            <tr>
                              <td colSpan="5">No orders found</td>
                            </tr>
                          ) : (
                            (filteredOrders || orders)?.map((order) => (
                              <React.Fragment key={order._id}>
                                <tr key={order._id}>
                                  <td>{order.orderNumber}</td>
                                  <td>
                                    {
                                      //only show sate and time
                                      order.date.split("T")[0]
                                    }
                                  </td>
                                  <td>
                                    {order.cancelled
                                      ? "Cancelled"
                                      : order.status
                                      ? "Delivered"
                                      : "Pending"}
                                    {/* {currentOrder === order && (
                                      <div className="my-2">
                                        <span>
                                          <input
                                            type="radio"
                                            id="pending"
                                            name="status"
                                            value="pending"
                                            checked={
                                              selectedStatus === "Pending"
                                            }
                                            onChange={() =>
                                              setSelectedStatus("Pending")
                                            }
                                          />
                                          <span class="checkmark"></span>
                                          <label htmlFor="pending">
                                            Pending
                                          </label>
                                        </span>
                                        <span>
                                          <input
                                            type="radio"
                                            id="cancelled"
                                            name="status"
                                            value="cancelled"
                                            checked={
                                              selectedStatus === "Cancelled"
                                            }
                                            onChange={() =>
                                              setSelectedStatus("Cancelled")
                                            }
                                          />
                                          <span class="checkmark"></span>
                                          <label htmlFor="cancelled">
                                            Cancelled
                                          </label>
                                        </span>
                                        <span>
                                          <input
                                            type="radio"
                                            id="delivered"
                                            name="status"
                                            value="delivered"
                                            checked={
                                              selectedStatus === "Delivered"
                                            }
                                            onChange={() =>
                                              setSelectedStatus("Delivered")
                                            }
                                          />
                                          <span class="checkmark"></span>
                                          <label htmlFor="delivered">
                                            Delivered
                                          </label>
                                        </span>
                                        <button className="btn p-2 ms-3">
                                          apply
                                        </button>
                                      </div>
                                    )} */}
                                  </td>
                                  <td>Rs.{order.totalAmount}</td>
                                  <td className="d-flex justify-content-between">
                                    <Link
                                      href="#"
                                      className="btn-small d-block"
                                      onClick={(e) => {
                                        handleToggleOrderDetails(e, order); // Call the function to toggle order details
                                      }}
                                    >
                                      Details
                                      {!(currentOrder === order) && (
                                        <IoIosArrowDropdown className="ms-1" />
                                      )}
                                      {currentOrder === order && (
                                        <IoIosArrowDropupCircle className="ms-1" />
                                      )}
                                    </Link>

                                    <Link
                                      href="#"
                                      onClick={(e) => {
                                        handleDelete(e, order._id);
                                      }}
                                    >
                                      <BsFillTrashFill
                                        style={{ color: "red" }}
                                      />
                                    </Link>
                                  </td>
                                </tr>
                                {/* Conditionally render order details */}
                                {currentOrder === order && (
                                  <tr className="bg-light">
                                    <td colSpan="5">
                                      <div className="order-details mt-1">
                                        {/* Display order details here */}
                                        <h5> Items in Order</h5>
                                        <table className="table">
                                          <thead>
                                            <tr>
                                              <th>Medicine</th>
                                              <th>Quantity</th>
                                              <th>Price</th>
                                              <th>Total</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {order.items.map((item) => (
                                              <tr key={item._id}>
                                                <td>
                                                  <Link
                                                    href="/products/[slug]"
                                                    as={`/products/${item.medicine.slug}`}
                                                  >
                                                    {item.medicine.name}
                                                  </Link>
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                  Rs.{item.medicine.price}
                                                </td>
                                                <td>
                                                  Rs.
                                                  {item.medicine.price *
                                                    item.quantity}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <h5>Delivery Details</h5>
                                            <p>
                                              Deliver to: {order.address}-{" "}
                                              {order.city} - {order.user.phone}
                                            </p>
                                          </div>
                                          <div>
{ !order.cancelled && !order.status && 
                                            <span
                                              style={{
                                                width: "70px",
                                                textAlign: "center",
                                                color: "#fff",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                backgroundColor: "#35927c",
                                                boxShadow:
                                                  "0 4px 2px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.11)",
                                                cursor: "pointer",
                                                marginRight: "12px",
                                                // display: order.status ? "none" : "block"
                                              }}
                                              onClick={(e) => {
                                                handleUpdateStatusClick(
                                                  e,
                                                  order._id
                                                );
                                              }}
                                            >
                                              Delivered
                                            </span>
                                          }
                                            {!order.cancelled &&
                                            !order.status ? (
                                              <span
                                                style={{
                                                  width: "70px",
                                                  textAlign: "center",
                                                  color: "#fff",
                                                  padding: "5px 10px",
                                                  borderRadius: "5px",
                                                  backgroundColor: "#ff1a1a",
                                                  boxShadow:
                                                    "0 4px 2px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.11)",
                                                  cursor: "pointer",
                                                  marginRight: "4px",
                                                }}
                                                onClick={(e) => {
                                                  handleCancelClick(
                                                    e,
                                                    order._id
                                                  );
                                                }}
                                              >
                                                Cancel
                                              </span>
                                            ) : order.cancelled ? (
                                              <span
                                                style={{
                                                  width: "70px",
                                                  textAlign: "center",
                                                  padding: "5px 10px",
                                                  borderRadius: "5px",
                                                  backgroundColor: "#ffec5f",
                                                  boxShadow:
                                                    "0 4px 2px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.11)",
                                                  marginRight: "4px",
                                                  cursor: "pointer",
                                                }}
                                                onClick={(e) => {
                                                  handleUndoClick(e, order._id);
                                                }}
                                              >
                                                Undo
                                              </span>
                                            ) : null}
                                          </div>
                                        </div>
                                        {/* Add more order details as needed */}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="primary-sidebar">
                      <div className="sidebar-widget product-sidebar mt-15 p-30 bg-grey border-radius-10">
                        <h5 className="section-title style-1 mb-30">
                          Sales History
                        </h5>

                        <div>
                          <h5>Today's Sale</h5>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Sales: </h6>
                            <p>Rs. {todaySales.sales}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className=" me-1">Profit: </h6>
                            <p>Rs. {todaySales.profit}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className="me-1">Orders: </h6>
                            <p>{todaySales.orders}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5>This Week Sales</h5>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Sales: </h6>
                            <p>Rs. {thisWeekSales.sales}</p>
                          </div>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Profit: </h6>
                            <p>Rs. {thisWeekSales.profit}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className="me-1">Orders: </h6>
                            <p>{thisWeekSales.orders}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5>This Month Sales</h5>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Sales: </h6>
                            <p>Rs. {thisMonthSales.sales}</p>
                          </div>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Profit: </h6>
                            <p>Rs. {thisMonthSales.profit}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className="me-1">Orders: </h6>
                            <p>{thisMonthSales.orders}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5>This Year Sales</h5>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Sales: </h6>
                            <p>Rs. {thisYearSales.sales}</p>
                          </div>
                          <div className="d-flex align-items-center mt-1">
                            <h6 className="me-1">Profit: </h6>
                            <p>Rs. {thisYearSales.profit}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className="me-1">Orders: </h6>
                            <p>{thisYearSales.orders}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row flex-row-reverse">
              <div className="col-lg-12">
                <h3 className="mb-30 mt-30">Your Products</h3>
                <div className="shop-product-fillter">
                  <div className="totall-product">
                    <p>
                      We found
                      <strong className="text-brand">
                        {products.items.length}
                      </strong>
                      items for you!
                    </p>
                  </div>
                  <div className="sort-by-product-area">
                    <div className="sort-by-cover mr-10">
                      <ShowSelect
                        selectChange={selectChange}
                        showLimit={showLimit}
                      />
                    </div>
                    <div className="sort-by-cover">
                      <SortSelect />
                    </div>
                  </div>
                </div>

                <div className="row product-grid-3">
                  {getPaginatedProducts.length === 0 && (
                    <h3>No Products Found </h3>
                  )}

                  {getPaginatedProducts.map((item, i) => (
                    <div
                      className="col-lg-1-5 col-md-4 col-12 col-sm-6"
                      key={i}
                    >
                      <SingleProduct
                        product={item}
                        handleMedicineDelete={handleMedicineDelete}
                      />
                      {/* <SingleProductList product={item}/> */}
                    </div>
                  ))}
                </div>

                <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
                  <nav aria-label="Page navigation example">
                    <Pagination
                      getPaginationGroup={getPaginationGroup}
                      currentPage={currentPage}
                      pages={pages}
                      next={next}
                      prev={prev}
                      handleActive={handleActive}
                    />
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        <WishlistModal />
        <QuickView />
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
});

const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};

export default connect(mapStateToProps, mapDidpatchToProps)(ProductsFullWidth);
