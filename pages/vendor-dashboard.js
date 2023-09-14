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
const [thisMonthSales, setThisMonthSales] = useState({ profit: 0, orders: 0 });

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
    try{
    const res = await fetch(`/api/order`);
    const data = await res.json();
    setOrders(data.data);
    const currentDate = new Date();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month

    let todayProfit = 0;
    let todayOrders = 0;
    let thisWeekProfit = 0;
    let thisWeekOrders = 0;
    let thisMonthProfit = 0;
    let thisMonthOrders = 0;

    data.data.forEach((order) => {
      const orderDate = new Date(order.date);

      if (orderDate.toDateString() === currentDate.toDateString()) {

        todayProfit += parseFloat(order.totalAmount);
        todayOrders++;
      }

      if (orderDate >= currentWeekStart) {
        thisWeekProfit += parseFloat(order.totalAmount);
        thisWeekOrders++;
      }

      if (orderDate >= currentMonthStart) {
        thisMonthProfit += parseFloat(order.totalAmount);
        thisMonthOrders++;
      }
    });

    setTodaySales({ profit: todayProfit.toFixed(2), orders: todayOrders });
    setThisWeekSales({ profit: thisWeekProfit.toFixed(2), orders: thisWeekOrders });
    setThisMonthSales({ profit: thisMonthProfit.toFixed(2), orders: thisMonthOrders });
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
    }
    );
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
    const confirmed = window.confirm("Are you sure you want to delete this medicine?");

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
                      <div className="input-group w-25">
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
                          {
                          (filteredOrders || orders)?.length === 0 ? (
                            <tr>
                              <td colSpan="5">No orders found</td>
                            </tr>
                          ):(
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
                                  {order.status ? "Delivered" : "Pending"}
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
                                      style={{ color: 'red' }}
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
                                      <div>
                                        <h5>Delivery Details</h5>
                                        <p>
                                          Deliver to: {order.address}-{" "}
                                          {order.city} - {order.user.phone}
                                        </p>
                                      </div>
                                      {/* Add more order details as needed */}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                          
                          ))
                          }
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
                            <p>Rs. {todaySales.profit}</p>
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
                            <h6 className="me-1">Profit: </h6>
                            <p>Rs. {thisMonthSales.profit}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className="me-1">Orders: </h6>
                            <p>{thisMonthSales.orders}</p>
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
                      <SingleProduct product={item}
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
