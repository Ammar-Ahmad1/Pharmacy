import Layout from "../components/layout/Layout";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ImageUpload from "../components/elements/ImageUpload";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
function Account() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [view, setView] = useState(false);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1);
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(null);
  const handleOnClick = (index) => {
    setActiveIndex(index); // remove the curly braces
  };
  const getUser = async () => {
    if (session) {
      const res = await fetch(`/api/users/${session.user.id}`);
      const data = await res.json();
      setUser(data.data);
    }
  };
  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const getOrders = async () => {
    if (session) {
      try {
        const res = await fetch(`/api/order?userId=${session.user.id}`);
        const data = await res.json();
        console.log(data.data);
        setOrders(data.data);
        // setUser(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  };
  const handleToggleOrderDetails = (order) => {
    if (currentOrder === order) {
      setCurrentOrder(null); // Deselect the order if it's already selected
    } else {
      setCurrentOrder(order); // Select the order if it's not selected
    }
  };
  const handleViewOrderDetails = (order) => {
    setCurrentOrder(order);
  };
  useEffect(() => {
    if (!session) {
      router.push("/page-login");
    }
    getUser();
    getOrders();
  }, [session]);

  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Account">
        <div className="page-content pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 m-auto">
                <div className="row">
                  <div className="col-md-3">
                    <div className="dashboard-menu">
                      <ul className="nav flex-column" role="tablist">
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 1 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(1)}
                          >
                            <i className="fi-rs-settings-sliders mr-10"></i>
                            Dashboard
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 2 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(2)}
                          >
                            <i className="fi-rs-shopping-bag mr-10"></i>Orders
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 3 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(3)}
                          >
                            <i className="fi-rs-shopping-cart-check mr-10"></i>
                            Track Your Order
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 4 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(4)}
                          >
                            <i className="fi-rs-marker mr-10"></i>My Address
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 5 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(5)}
                          >
                            <i className="fi-rs-user mr-10"></i>Account details
                          </a>
                        </li>
                        <li className="nav-item">
                          <Link
                            href="#"
                            className="nav-link"
                            onClick={handleLogout}
                          >
                            <i className="fi-rs-sign-out mr-10"></i>Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="tab-content account dashboard-content pl-50">
                      <div
                        className={
                          activeIndex === 1
                            ? "tab-pane fade active show"
                            : "tab-pane fade "
                        }
                      >
                        <div className="card">
                          <div className="card-header">
                            <h3 className="mb-0">Hello Rosie!</h3>
                          </div>
                          <div className="card-body">
                            <p>
                              From your account dashboard. you can easily check
                              &amp; view your <a href="#">recent orders</a>,
                              <br />
                              manage your{" "}
                              <a href="#">
                                shipping and billing addresses
                              </a> and{" "}
                              <a href="#">
                                edit your password and account details.
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          activeIndex === 2
                            ? "tab-pane fade active show"
                            : "tab-pane fade "
                        }
                      >
                        <div className="card">
                          <div className="card-header">
                            <h3 className="mb-0">Your Orders</h3>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Order</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders?.map((order) => (
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
                                      <td>
                                      <a
                                      href="#"
                                      className="btn-small d-block"
                                      onClick={() => {
                                        handleToggleOrderDetails(order); // Call the function to toggle order details
                                      }}
                                    >
                                          View
                                        </a>
                                      </td>
                                    </tr>
                                    {/* Conditionally render order details */}
                                  {currentOrder === order && (
                                    <tr>
                                      <td colSpan="5">
                                        <div className="order-details">
                                          {/* Display order details here */}
                                          <p>Order Number: {order.orderNumber}</p>
                                          <p>Date: {order.date.split("T")[0]}</p>
                                          <p>Status: {order.status ? "Delivered" : "Pending"}</p>
                                          <p>Total Amount: Rs.{order.totalAmount}</p>
                                          {/* Add more order details as needed */}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div
                        className={
                          activeIndex === 3
                            ? "tab-pane fade active show"
                            : "tab-pane fade "
                        }
                      >
                        <div className="card">
                          <div className="card-header">
                            <h3 className="mb-0">Orders tracking</h3>
                          </div>
                          <div className="card-body contact-from-area">
                            <p>
                              To track your order please enter your OrderID in
                              the box below and press "Track" button. This was
                              given to you on your receipt and in the
                              confirmation email you should have received.
                            </p>
                            <div className="row">
                              <div className="col-lg-8">
                                <form
                                  className="contact-form-style mt-30 mb-50"
                                  action="#"
                                  method="post"
                                >
                                  <div className="input-style mb-20">
                                    <label>Order ID</label>
                                    <input
                                      name="order-id"
                                      placeholder="Found in your order confirmation email"
                                      type="text"
                                    />
                                  </div>
                                  <div className="input-style mb-20">
                                    <label>Billing email</label>
                                    <input
                                      name="billing-email"
                                      placeholder="Email you used during checkout"
                                      type="email"
                                    />
                                  </div>
                                  <button
                                    className="submit submit-auto-width"
                                    type="submit"
                                  >
                                    Track
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          activeIndex === 4
                            ? "tab-pane fade active show"
                            : "tab-pane fade "
                        }
                      >
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="card mb-3 mb-lg-0">
                              <div className="card-header">
                                <h3 className="mb-0">Billing Address</h3>
                              </div>
                              <div className="card-body">
                                <address>
                                  3522 Interstate
                                  <br />
                                  75 Business Spur,
                                  <br />
                                  Sault Ste. <br />
                                  Marie, MI 49783
                                </address>
                                <p>New York</p>
                                <a href="#" className="btn-small">
                                  Edit
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="card">
                              <div className="card-header">
                                <h5 className="mb-0">Shipping Address</h5>
                              </div>
                              <div className="card-body">
                                <address>
                                  4299 Express Lane
                                  <br />
                                  Sarasota, <br />
                                  FL 34249 USA <br />
                                  Phone: 1.941.227.4444
                                </address>
                                <p>Sarasota</p>
                                <a href="#" className="btn-small">
                                  Edit
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          activeIndex === 5
                            ? "tab-pane fade active show"
                            : "tab-pane fade "
                        }
                      >
                        <div className="card">
                          <div className="card-header">
                            <h5>Account Details</h5>
                          </div>
                          <div className="card-body">
                            <p>
                              Already have an account?{" "}
                              <Link href="/page-login">Log in instead!</Link>
                            </p>
                            <form method="post" name="enq">
                              <div className="row">
                                <div className="form-group col-md-6">
                                  <label>
                                    First Name{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="name"
                                    type="text"
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label>
                                    Last Name{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="phone"
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>
                                    Display Name{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="dname"
                                    type="text"
                                    value={user?.name}
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>
                                    Email Address{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="email"
                                    type="email"
                                    value={user?.email}
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>
                                    Current Password{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    value={user?.password}
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>
                                    New Password{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="npassword"
                                    type="password"
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>
                                    Confirm Password{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="cpassword"
                                    type="password"
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>
                                    Date of Birth{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    className="form-control"
                                    name="birth"
                                    type="date"
                                  />
                                </div>
                                <div>
                                  <p>
                                    Gender <span>*</span>
                                  </p>
                                  <div className="form-check custom-control custom-radio d-flex col-lg-6 col-md-8 col-sm-12 justify-content-around">
                                    <div className="custome-radio">
                                      <input
                                        className="form-check-input"
                                        required=""
                                        type="radio"
                                        name="payment_option"
                                        id="exampleRadios1"
                                        defaultChecked=""
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="exampleRadios1"
                                        data-bs-toggle="collapse"
                                        data-target="#bankTranfer"
                                        aria-controls="bankTranfer"
                                      >
                                        Male
                                      </label>
                                    </div>
                                    <div className="custome-radio">
                                      <input
                                        className="form-check-input"
                                        required=""
                                        type="radio"
                                        name="payment_option"
                                        id="exampleRadios2"
                                        defaultChecked=""
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="exampleRadios2"
                                        data-bs-toggle="collapse"
                                        data-target="#checkPayment"
                                        aria-controls="checkPayment"
                                      >
                                        Female
                                      </label>
                                    </div>
                                    <div className="custome-radio">
                                      <input
                                        className="form-check-input"
                                        required=""
                                        type="radio"
                                        name="payment_option"
                                        id="exampleRadios3"
                                        defaultChecked=""
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="exampleRadios3"
                                        data-bs-toggle="collapse"
                                        data-target="#checkPayment"
                                        aria-controls="checkPayment"
                                      >
                                        Other
                                      </label>
                                    </div>
                                  </div>
                                  <br />
                                </div>
                                <div className="col-md-12">
                                  <button
                                    type="submit"
                                    className="btn btn-fill-out submit font-weight-bold"
                                    name="submit"
                                    value="Submit"
                                  >
                                    Save Change
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <ImageUpload />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Account;
