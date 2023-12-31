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
import Preloader from "../components/elements/Preloader";
import Link from "next/link";

// icons
import { FaRegTrashCan } from "react-icons/fa6";
import { HiMiniXMark } from "react-icons/hi2";
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
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  let Router = useRouter(),
    searchTerm = Router.query.search,
    showLimit = 100,
    // showLimit = products.items.length,
    showPagination = 4;

  let [pagination, setPagination] = useState([]);
  let [limit, setLimit] = useState(showLimit);
  let [pages, setPages] = useState(Math.ceil(products.items.length / limit));
  let [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProduct(searchTerm, "/api/medicine", productFilters);
    cratePagination();
  }, [productFilters, limit, pages, products.items.length]);
  useEffect(() => {  
      if (session?.user.role === "customer") {
        Router.push("/");
      } else if (session?.user.role === "vendor") {
        getOrders();
      }else if (!session) {
        Router.push("/page-login");
      } 
  }, [session]);

  const getOrders = async () => {
    if (!session) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/order');
      const data = await res.json();
      setOrders(data.data);
  
      const salesStats = calculateSalesStats(data.data);
      setTodaySales(salesStats.todaySales);
      setThisWeekSales(salesStats.thisWeekSales);
      setThisMonthSales(salesStats.thisMonthSales);
      setThisYearSales(salesStats.thisYearSales);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };
  const calculateSalesStats = (orders) => {
    const currentDate = new Date();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
  
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
  
    orders.forEach((order) => {
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
  
    return {
      todaySales: {
        profit: todayProfit.toFixed(2),
        orders: todayOrders,
        sales: todaySales.toFixed(2),
      },
      thisWeekSales: {
        profit: thisWeekProfit.toFixed(2),
        orders: thisWeekOrders,
        sales: thisWeekSales.toFixed(2),
      },
      thisMonthSales: {
        profit: thisMonthProfit.toFixed(2),
        orders: thisMonthOrders,
        sales: thisMonthSales.toFixed(2),
      },
      thisYearSales: {
        profit: thisYearProfit.toFixed(2),
        orders: thisYearOrders,
        sales: thisYearSales.toFixed(2),
      },
    };
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
    if (!orderDetailsOpen) {
      setOrderDetailsOpen(true);
    } else {
      setOrderDetailsOpen(false);
    }
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
          return !order.cancelled && order.status === "Pending";
        } else if (filter === "delivered") {
          return order.status === "Delivered";
        } else if (filter === "cancelled") {
          return order.cancelled;
        } else if (filter === "confirmed") {
          return !order.cancelled && order.status === "Confirmed";
        }
      });

      setFilteredOrders(filtered);
    }
  };
  const handleUpdateStatusClickDeliver = async (e, orderId, status) => {
    if (status === "Pending") {
      toast.error("Order is not confirmed yet");
      return;
    }

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
  const handleUpdateStatusClickConfirm = async (e, orderId) => {
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
      const response = await fetch(`/api/order/confirm/${orderId}`, {
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

  // Status Color

  const getStatusStyle = (status) => {
    let style = {};

    switch (status) {
      case "Delivered":
        style.backgroundColor = "#28a745";
        style.color = "white";
        style.borderRadius = "4px";
        style.padding = "0px 4px";
        style.textAlign = "center";
        break;
      case "Confirmed":
        style.backgroundColor = "#17a2b8";
        style.color = "white";
        style.borderRadius = "4px";
        style.padding = "0px 4px";
        style.textAlign = "center";
        break;
      case "Cancelled":
        style.backgroundColor = "#f83535";
        style.color = "white";
        style.borderRadius = "4px";
        style.padding = "0px 4px";
        style.textAlign = "center";
        break;
      case "Pending":
        style.backgroundColor = "#ebe22f";
        style.color = "black";
        style.borderRadius = "4px";
        style.padding = "0px 4px";
        style.textAlign = "center";
        break;
      default:
        style.backgroundColor = "#f83535";
        style.color = "black";
        style.borderRadius = "4px";
        style.padding = "0px 4px";
        style.textAlign = "center";
        break;
    }

    return style;
  };

  return (
    <>
      {loading ? (
        // Render a loading indicator while loading is true
       <Preloader />
      ) : (
      <Layout parent="Home" sub="Vendor  " subChild="Dashboard">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="mt-30 pb-30 h1 font-xxl font-weight-bold">
                  Dashboard
                </h1>
                <hr className="mb-80" />
                <div className="row">
                  <div className="col-lg-9">
                    <h3 className="h1 font-weight-bold me-4">All Orders</h3>
                    <div className="table-responsive mt-20 ps-2 pe-2">
                      <div className="input-group d-flex justify-content-between">
                        <div className="d-flex align-items-end">
                          <label htmlFor="search-order">
                            {" "}
                            Search by Order Number
                            <input
                              type="search"
                              id="search-order"
                              className="form-control-search col-sm-12 d-lg-block"
                              placeholder="Search Orders"
                              aria-label="Search Orders"
                              aria-describedby="basic-addon2"
                              // value={searchOrder}
                              onChange={handleSearchChange}
                            />
                          </label>
                        </div>
                        {/* add filters for pending, delivered and cancelled orders */}
                        <div className="input-group-append">
                          <div className="mb-4">
                            <label>
                              Sort by status
                              <select
                                className="form-select"
                                style={{
                                  outline: "none",
                                  borderColor: "#ced4da",
                                  boxShadow: "none",
                                }}
                                onChange={handleFilterChange}
                              >
                                <option value="">All Orders</option>
                                <option value="pending">Pending Orders</option>
                                <option value="delivered">
                                  Delivered Orders
                                </option>
                                <option value="cancelled">
                                  Cancelled Orders
                                </option>
                                <option value="confirmed">
                                  Confirmed Orders
                                </option>
                              </select>
                            </label>
                          </div>
                          <div>
                            <label htmlFor="date-table">
                              Search by date
                              <input
                                type="date"
                                id="date-table"
                                className="pe-3 col-12 d-block form-control-search"
                                onChange={(e) => {
                                  // Filter the orders based on the search term
                                  //ignore case
                                  const filtered = orders.filter((order) =>
                                    order.date
                                      .split("T")[0]
                                      .includes(e.target.value)
                                  );
                                  setFilteredOrders(filtered);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <br />
                      <table className="table table-striped">
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
                                {order && (
                                  <tr
                                    key={order._id}
                                    className={
                                      currentOrder === order ? "active-row" : ""
                                    }
                                  >
                                    <td className="font-weight-bold">
                                      {order.orderNumber}
                                    </td>
                                    <td>
                                      {
                                        //only show sate and time
                                        order.date.split("T")[0]
                                      }
                                    </td>
                                    <td>
                                      {order.cancelled ? (
                                        <p
                                          style={{
                                            ...getStatusStyle("Cancelled"),
                                            maxWidth: "120px",
                                            margin: "0 auto",
                                          }}
                                        >
                                          Cancelled
                                        </p>
                                      ) : (
                                        <p
                                          style={{
                                            ...getStatusStyle(order.status),
                                            maxWidth: "120px",
                                            margin: "0 auto",
                                          }}
                                        >
                                          {order.status}
                                        </p>
                                      )}
                                    </td>
                                    <td>Rs.{order.totalAmount}</td>
                                    <td className="d-flex justify-content-between">
                                      <Link
                                        style={{
                                          width: "80px",
                                          textAlign: "center",
                                          color: "#fff",
                                          borderRadius: "5px",
                                          backgroundColor: "#4a4175",
                                          cursor: "pointer",
                                        }}
                                        href="#"
                                        className="btn-small"
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
                                        <FaRegTrashCan
                                          style={{ color: "#f83535" }}
                                        />
                                      </Link>
                                    </td>
                                  </tr>
                                )}
                                {/* Conditionally render order details */}
                                {currentOrder === order && (
                                  <tr
                                    style={{
                                      backgroundColor: "#d9e3ea",
                                      padding: "10px !important",
                                    }}
                                  >
                                    <td colSpan="5">
                                      <div className="order-details mt-1">
                                        {/* Display order details here */}
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                          <h5> Items in Order</h5>
                                          <HiMiniXMark
                                            style={{ fontSize: "20px" }}
                                            onClick={(e) => {
                                              handleToggleOrderDetails(
                                                e,
                                                order
                                              ); // Call the function to toggle order details
                                            }}
                                          />
                                        </div>
                                        <table
                                          className="table"
                                          style={{ backgroundColor: "#eff3f6" }}
                                        >
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
                                            <h5>Customer Details</h5>
                                            <p>Deliver to:</p>
                                            <ul>
                                              <li>
                                                <span className="me-2 font-weight-bold">
                                                  Address:
                                                </span>
                                                {order.address}
                                              </li>
                                              <li>
                                                <span className="me-2 font-weight-bold">
                                                  Ph #:
                                                </span>
                                                {order.user.phone}
                                              </li>
                                              <li>
                                                <span className="me-2 font-weight-bold">
                                                  City:
                                                </span>
                                                {order.city}
                                              </li>
                                            </ul>
                                          </div>
                                          <div>
                                            {!order.cancelled &&
                                              (order.status === "Pending" ||
                                                order.status ===
                                                  "Confirmed") && (
                                                <span>
                                                  {!(
                                                    order.status === "Confirmed"
                                                  ) ? (
                                                    <span
                                                      style={{
                                                        width: "70px",
                                                        textAlign: "center",
                                                        color: "#fff",
                                                        padding: "5px 10px",
                                                        borderRadius: "5px",
                                                        backgroundColor:
                                                          "#17a2b8",
                                                        cursor: "pointer",
                                                        marginRight: "12px",
                                                        // display: order.status ? "none" : "block"
                                                      }}
                                                      onClick={(e) => {
                                                        handleUpdateStatusClickConfirm(
                                                          e,
                                                          order._id
                                                        );
                                                      }}
                                                    >
                                                      Confirmed
                                                    </span>
                                                  ) : null}

                                                  <span
                                                    style={{
                                                      width: "70px",
                                                      textAlign: "center",
                                                      color: "#fff",
                                                      padding: "5px 10px",
                                                      borderRadius: "5px",
                                                      backgroundColor:
                                                        "#28a745",
                                                      cursor: "pointer",
                                                      marginRight: "12px",
                                                      // display: order.status ? "none" : "block"
                                                    }}
                                                    onClick={(e) => {
                                                      handleUpdateStatusClickDeliver(
                                                        e,
                                                        order._id,
                                                        order.status
                                                      );
                                                    }}
                                                  >
                                                    Delivered
                                                  </span>
                                                </span>
                                              )}
                                            {!order.cancelled &&
                                            (order.status === "Pending" ||
                                              order.status === "Confirmed") ? (
                                              <span
                                                style={{
                                                  width: "70px",
                                                  textAlign: "center",
                                                  color: "#fff",
                                                  padding: "5px 10px",
                                                  borderRadius: "5px",
                                                  backgroundColor: "#f83535",
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

            <Link
              className="btn btn-small mt-4 hover: font-weight-bold"
              href={"/add-item"}
            >
              Add Medicine
            </Link>

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
                      className="col-lg-1-5 col-md-4 col-12 col-sm-6 d-flex"
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
      )}
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
