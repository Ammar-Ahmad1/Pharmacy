import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  clearCart,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../redux/action/cart";

const Cart = ({
  openCart,
  cartItems,
  activeCart,
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  clearCart,
}) => {
  const [delivery, setDelivery] = useState(0);
  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item.price * item.quantity));

    return price;
  };

  useEffect(() => {
    if (price() > 1000) {
      setDelivery(200);
    } else {
      setDelivery(300);
    }
  }, [price()]);
  const router = useRouter();

  const handleRoute = (e) => {
    e.preventDefault();
    if (cartItems.length <= 0) return toast.error("Cart is empty");
    router.push("/shop-checkout");
  };

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Cart">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Your Cart</h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    Carefully check the information before checkout
                  </h6>
                  {/* <h6 className="text-body">
                                        <a href="#" className="text-muted">
                                            <i className="fi-rs-trash mr-5"></i>
                                            Clear Cart
                                        </a>
                                    </h6> */}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="table-responsive shopping-summery">
                  {cartItems.length <= 0 && "No Products"}
                  <table
                    className={
                      cartItems.length > 0 ? "table table-wishlist" : "d-none"
                    }
                  >
                    <thead>
                      <tr className="main-heading">
                        <th
                          className="custome-checkbox start pl-30"
                          colSpan="2"
                        >
                          Product
                        </th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Subtotal</th>
                        <th scope="col" className="end">
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, i) => (
                        <tr key={i}>
                          <td className="image product-thumbnail">
                            <img
                              src={
                                item.images ? item.images[0]?.img : item.image
                              }
                            />
                          </td>

                          <td className="product-des product-name">
                            <h6 className="product-name">
                              <Link href="/products">
                                {item.title || item.name}
                              </Link>
                            </h6>
                            <div className="product-rate-cover">
                              <div className="product-rate d-inline-block">
                                <div
                                  className="product-rating"
                                  style={{
                                    width: "90%",
                                  }}
                                ></div>
                              </div>
                              <span className="font-small ml-5 text-muted">
                                {" "}
                                (4.0)
                              </span>
                            </div>
                          </td>
                          <td className="price" data-title="Price">
                            <h4 className="text-brand">Rs.{item.price}</h4>
                          </td>
                          <td
                            className="text-center detail-info"
                            data-title="Stock"
                          >
                            <div className="detail-extralink mr-15">
                              <div className="detail-qty border radius ">
                                <a
                                  onClick={(e) => decreaseQuantity(item._id)}
                                  className="qty-down"
                                >
                                  <i className="fi-rs-angle-small-down"></i>
                                </a>
                                <span className="qty-val">{item.quantity}</span>
                                <a
                                  onClick={(e) => increaseQuantity(item._id)}
                                  className="qty-up"
                                >
                                  <i className="fi-rs-angle-small-up"></i>
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="text-right" data-title="Cart">
                            <h4 className="text-body">
                              Rs.{item.quantity * item.price}
                            </h4>
                          </td>
                          <td className="action" data-title="Remove">
                            <a
                              onClick={(e) => deleteFromCart(item._id)}
                              className="text-muted"
                            >
                              <i className="fi-rs-trash"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="6" className="text-end">
                          {cartItems.length > 0 && (
                            <a onClick={clearCart} className="text-muted">
                              <i className="fi-rs-cross-small"></i>
                              Clear Cart
                            </a>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="divider center_icon mb-25">
                  <br />
                </div>

                
                <div className="d-lg-flex columnReverse justify-content-between">
                  <div className="col-lg-6 col-md-12 order-sm-1 order-lg-2 mb-50">
                    <div className="border p-md-4 p-30 border-radius cart-totals">
                      <div className="heading_s1 mb-3">
                        <h4>Cart Totals</h4>
                      </div>
                      <div className="table-responsive order-md-2">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="cart_total_label">
                                Cart Subtotal
                              </td>
                              <td className="cart_total_amount">
                                <span className="font-lg fw-900 text-brand">
                                  Rs. {price()}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cart_total_label">Shipping</td>
                              <td className="cart_total_amount">
                                <i className="ti-gift mr-5"></i>
                                {delivery == 0
                                  ? "Free Shipping"
                                  : `Rs. ${delivery}`}
                              </td>
                            </tr>
                            <tr>
                              <td className="cart_total_label">Total</td>
                              <td className="cart_total_amount">
                                <strong>
                                  <span className="font-xl fw-900 text-brand">
                                    Rs. {price() + delivery}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <a href="#" onClick={handleRoute} className="btn">
                        <i className="fi-rs-box-alt mr-10"></i>
                        Proceed To CheckOut
                      </a>
                    </div>
                  </div>
                  <div className="cart-action order-sm-2 order-lg-1">
                    <a className="btn" onClick={() => router.push("/products")}>
                      <i className="fi-rs-shopping-bag mr-10"></i>
                      Continue Shopping
                    </a>
                  </div>
                </div>


                <div className="row mb-50">
                  {/* <div className="col-lg-6 col-md-12">
                                        <div className="heading_s1 mb-3">
                                            <h4>Calculate Shipping</h4>
                                        </div>
                                        <p className="mt-15 mb-30">
                                            Flat rate:
                                            <span className="font-xl text-brand fw-900">5%</span>
                                        </p>
                                        <form className="field_form shipping_calculator">
                                            <div className="form-row row">
                                                <div className="form-group col-lg-6">
                                                    <input required="required" placeholder="State / Country" name="name" type="text" />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input required="required" placeholder="PostCode / ZIP" name="name" type="text" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-lg-12">
                                                    <button className="btn  btn-sm">
                                                        <i className="fi-rs-shuffle mr-10"></i>
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="mb-30 mt-50">
                                            <div className="heading_s1 mb-3">
                                                <h4>Apply Coupon</h4>
                                            </div>
                                            <div className="total-amount">
                                                <div className="left">
                                                    <div className="coupon">
                                                        <form action="#" target="_blank">
                                                            <div className="form-row row justify-content-center">
                                                                <div className="form-group col-lg-6">
                                                                    <input className="font-medium" name="Coupon" placeholder="Enter Your Coupon" />
                                                                </div>
                                                                <div className="form-group col-lg-6">
                                                                    <button className="btn  btn-sm">
                                                                        <i className="fi-rs-label mr-10"></i>
                                                                        Apply
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  activeCart: state.counter,
});

const mapDispatchToProps = {
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  openCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
