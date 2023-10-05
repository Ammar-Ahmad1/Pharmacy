import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CategoryProduct2 from "../ecommerce/Filter/CategoryProduct2";
import CategoryProduct3 from "../ecommerce/Filter/CategoryProduct3";
import Search from "../ecommerce/Search";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const Header = ({
  totalCartItems,
  totalCompareItems,
  toggleClick,
  totalWishlistItems,
}) => {
  const [isToggled, setToggled] = useState(false);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY >= 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });
  const { data: session } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleToggle = () => setToggled(!isToggled);

  return (
    <>
      <header className="header-area header-style-1 header-height-2">
        <div className="mobile-promotion">
          <span>
            Grand opening, <strong>up to 15%</strong> off all items. Only{" "}
            <strong>3 days</strong> left
          </span>
        </div>

        <div className="header-top header-top-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-xl-3 col-lg-4">
                <div className="header-info">
                  <ul>
                    <li>
                      <Link href="/page-about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/page-account">My Account</Link>
                    </li>
                    <li>
                      <Link href="/shop-wishlist">Wishlist</Link>
                    </li>
                    {/* <li>
                       <Link href="/page-account">Order Tracking</Link> 
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4">
                <div className="header-info header-info-right">
                  <ul>
                    <li>
                      Need help? Call Us:{" "}
                      <strong className="text-brand"> + 1800 900</strong>
                    </li>
                    {/* <li>
                      <Link href="/#" className="language-dropdown-active">
                        <i className="fi-rs-world"></i>
                        English
                        <i className="fi-rs-angle-small-down"></i>
                      </Link>
                      <ul className="language-dropdown">
                        <li>
                          <Link href="/#">
                            <img
                              src="/assets/imgs/theme/flag-fr.png"
                              alt="nest"
                            />
                            Français
                          </Link>
                        </li>
                        <li>
                          <Link href="/#">
                            <img
                              src="/assets/imgs/theme/flag-dt.png"
                              alt="nest"
                            />
                            Deutsch
                          </Link>
                        </li>
                        <li>
                          <Link href="/#">
                            <img
                              src="/assets/imgs/theme/flag-ru.png"
                              alt="nest"
                            />
                            Pусский
                          </Link>
                        </li>
                      </ul>
                    </li> */}
                    {/* <li>
                      <a className="language-dropdown-active" href="#">
                        USD <i className="fi-rs-angle-small-down"></i>
                      </a>
                      <ul className="language-dropdown">
                        <li>
                          <a href="#">
                            <img
                              src="/assets/imgs/theme/flag-fr.png"
                              alt="nest"
                            />
                            INR
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img
                              src="/assets/imgs/theme/flag-dt.png"
                              alt="nest"
                            />
                            MBP
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img
                              src="/assets/imgs/theme/flag-ru.png"
                              alt="nest"
                            />
                            EU
                          </a>
                        </li>
                      </ul>
                    </li> */}
                    {!session?.user?.id && (
                      <li>
                        <Link href="/page-register" className="text-brand">
                          Sign Up
                        </Link>
                      </li>
                    )}
                    {!session?.user?.id && (
                      <li>
                        <Link href="/page-login" className="text-brand">
                          Log In
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="header-wrap">
              <div className="logo logo-width-2">
                <Link href="/">
                  <img src="/assets/imgs/oxygenGreen.svg" alt="logo" />
                </Link>
              </div>
              <div className="header-right mx-4">
                <div className="search-style-2">
                  <Search />
                </div>
                <div className="header-action-right">
                  <div className="header-action-2">
                    <div
                      className="header-action-icon-2"
                      style={{
                        display:
                          session?.user?.role === "vendor" ? "none" : "block",
                      }}
                    >
                      <Link href="/shop-compare">
                        <img
                          className="svgInject"
                          alt="Evara"
                          src="/assets/imgs/theme/icons/icon-compare.svg"
                        />
                        <span className="pro-count blue">
                          {totalCompareItems}
                        </span>
                      </Link>
                      <Link href="/shop-compare">
                        <span className="lable ml-0">Compare</span>
                      </Link>
                    </div>
                    <div
                      className="header-action-icon-2"
                      style={{
                        display:
                          session?.user?.role === "vendor" ? "none" : "block",
                      }}
                    >
                      <Link href="/shop-wishlist">
                        <img
                          className="svgInject"
                          alt="Evara"
                          src="/assets/imgs/theme/icons/icon-heart.svg"
                        />
                        <span className="pro-count blue">
                          {totalWishlistItems}
                        </span>
                      </Link>
                      <Link href="/shop-wishlist">
                        <span className="lable">Wishlist</span>
                      </Link>
                    </div>
                    <div
                      className="header-action-icon-2"
                      style={{
                        display:
                          session?.user?.role === "vendor" ? "none" : "block",
                      }}
                    >
                      <Link href="/shop-cart" className="mini-cart-icon">
                        <img
                          alt="Evara"
                          src="/assets/imgs/theme/icons/icon-cart.svg"
                        />
                        <span className="pro-count blue">{totalCartItems}</span>
                      </Link>
                      <Link href="/shop-cart">
                        <span className="lable">Cart</span>
                      </Link>
                    </div>

                    {session?.user?.id && (
                      <div className="header-action-icon-2">
                        <Link href="/page-account">
                          <img
                            className="svgInject"
                            alt="Nest"
                            src="/assets/imgs/theme/icons/icon-user.svg"
                          />
                        </Link>
                        <Link href="/page-account">
                          <span className="lable ml-0">Account</span>
                        </Link>
                        <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                          <ul>
                            <li>
                              <Link href="/page-account">
                                <i className="fi fi-rs-user mr-10"></i>
                                My Account
                              </Link>
                            </li>
                            <li
                              style={{
                                display:
                                  session?.user?.role === "vendor"
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Link href="/page-account">
                                <i className="fi fi-rs-location-alt mr-10"></i>
                                Order Tracking
                              </Link>
                            </li>
                            <li
                              style={{
                                display:
                                  session?.user?.role === "vendor"
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Link href="/page-account">
                                <i className="fi fi-rs-label mr-10"></i>
                                My Voucher
                              </Link>
                            </li>
                            <li
                              style={{
                                display:
                                  session?.user?.role === "vendor"
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Link href="/shop-wishlist">
                                <i className="fi fi-rs-heart mr-10"></i>
                                My Wishlist
                              </Link>
                            </li>
                            <li>
                              <Link href="/page-account">
                                <i className="fi fi-rs-settings-sliders mr-10"></i>
                                Setting
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <i
                                  className="fi fi-rs-sign-out mr-10"
                                  onClick={handleLogout}
                                ></i>
                                <span onClick={handleLogout}>Sign out</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            scroll
              ? "header-bottom header-bottom-bg-color sticky-bar stick"
              : "header-bottom header-bottom-bg-color sticky-bar"
          }
        >
          <div className="container">
            <div className="header-wrap header-space-between position-relative">
              <div className="logo logo-width-1 d-block d-lg-none">
                <Link href="/">
                  <img src="/assets/imgs/oxygenGreen.svg" alt="logo" />
                </Link>
              </div>
              <div className="header-nav d-none d-lg-flex">
                <div className="main-categori-wrap d-none d-lg-block">
                  <a
                    className="categories-button-active"
                    onClick={handleToggle}
                  >
                    <span className="fi-rs-apps"></span>
                    Categories
                    <i className="fi-rs-angle-down"></i>
                  </a>

                  <div
                    className={
                      isToggled
                        ? "categories-dropdown-wrap categories-dropdown-active-large font-heading open"
                        : "categories-dropdown-wrap categories-dropdown-active-large font-heading"
                    }
                  >
                    <div className="d-flex categori-dropdown-inner">
                      <CategoryProduct2 />
                      <CategoryProduct3 />
                    </div>
                    <div
                      className="more_slide_open"
                      style={{ display: "none" }}
                    >
                      <div className="d-flex categori-dropdown-inner">
                        <ul>
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-1.svg"
                                alt="nest"
                              />
                              Milks and Dairies
                            </Link>
                          </li>
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-2.svg"
                                alt="nest"
                              />
                              Clothing & beauty
                            </Link>
                          </li>
                        </ul>
                        <ul className="end">
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-3.svg"
                                alt="nest"
                              />
                              Wines & Drinks
                            </Link>
                          </li>
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-4.svg"
                                alt="nest"
                              />
                              Fresh Seafood
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block  font-heading">
                  <nav>
                    <ul>
                      <li className="hot-deals">
                        <img
                          src="/assets/imgs/theme/icons/icon-hot.svg"
                          alt="hot deals"
                        />
                        <Link href="/products">Hot Deals</Link>
                      </li>
                      <li>
                        <Link href="/">Home</Link>
                      </li>

                      <li>
                        <Link href="/products">
                          Shop
                          {/* <i className="fi-rs-angle-down"></i> */}
                        </Link>
                      </li>

                      <li>
                        <a href="/vendor-dashboard">
                          Vendors 
                          {/* <i className="fi-rs-angle-down"></i> */}
                        </a>
                        {/* <ul className="sub-menu">
                          <li>
                            <Link href="/vendors">Vendors Grid</Link>
                          </li>
                          <li>
                            <Link href="/vendors-list">Vendors List</Link>
                          </li>
                          <li>
                            <Link href="/vendor-dashboard">
                              Vendor Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link href="/vendor-guide">Vendor Guide</Link>
                          </li>
                        </ul> */}
                      </li>

                      <li>
                        <Link href="/#">
                          Pages
                          <i className="fi-rs-angle-down"></i>
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link href="/page-about">About Us</Link>
                          </li>
                          <li>
                            <Link href="/add-item">Add Item</Link>
                          </li>
                          <li>
                            <Link href="/page-contact">Contact</Link>
                          </li>
                          <li>
                            <Link href="/page-account">My Account</Link>
                          </li>
                          <li>
                            <Link href="/page-login">Login</Link>
                          </li>
                          <li>
                            <Link href="/page-register">Register</Link>
                          </li>
                          <li>
                            <Link href="/page-purchase-guide">
                              Purchase Guide
                            </Link>
                          </li>
                          <li>
                            <Link href="/page-privacy-policy">
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link href="/page-terms">Terms of Service</Link>
                          </li>
                          <li>
                            <Link href="/page-404">404 Page</Link>
                          </li>
                          <li>
                            <Link href="/forget-password">Forget Password</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/page-about">About</Link>
                      </li>
                      <li>
                        <Link href="/page-contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="hotline d-none d-lg-flex">
                <img
                  src="/assets/imgs/theme/icons/icon-headphone.svg"
                  alt="hotline"
                />

                <p>
                  1900 - 888<span>24/7 Support Center</span>
                </p>
              </div>

              <div className="header-action-icon-2 d-block d-lg-none">
                <div
                  className="burger-icon burger-icon-white"
                  onClick={toggleClick}
                >
                  <span className="burger-icon-top"></span>
                  <span className="burger-icon-mid"></span>
                  <span className="burger-icon-bottom"></span>
                </div>
              </div>

              <div className="header-action-right d-block d-lg-none">
                <div className="header-action-2">
                  <div className="header-action-icon-2">
                    <Link href="/shop-wishlist">
                      <img
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-heart.svg"
                      />
                      <span className="pro-count white">
                        {totalWishlistItems}
                      </span>
                    </Link>
                  </div>
                  <div className="header-action-icon-2">
                    <Link href="/shop-cart" className="mini-cart-icon">
                      <img
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-cart.svg"
                      />
                      <span className="pro-count white">{totalCartItems}</span>
                    </Link>
                    <div className="cart-dropdown-wrap cart-dropdown-hm2">
                      <ul>
                        <li>
                          <div className="shopping-cart-img">
                            <Link href="/shop-grid-right">
                              <img
                                alt="Evara"
                                src="/assets/imgs/shop/thumbnail-3.jpg"
                              />
                            </Link>
                          </div>
                          <div className="shopping-cart-title">
                            <h4>
                              <Link href="/shop-grid-right">
                                Plain Striola Shirts
                              </Link>
                            </h4>
                            <h3>
                              <span>1 × </span>
                              Rs.800.00
                            </h3>
                          </div>
                          <div className="shopping-cart-delete">
                            <Link href="/#">
                              <i className="fi-rs-cross-small"></i>
                            </Link>
                          </div>
                        </li>
                        <li>
                          <div className="shopping-cart-img">
                            <Link href="/shop-grid-right">
                              <img
                                alt="Evara"
                                src="/assets/imgs/shop/thumbnail-4.jpg"
                              />
                            </Link>
                          </div>
                          <div className="shopping-cart-title">
                            <h4>
                              <Link href="/shop-grid-right">
                                Macbook Pro 2024
                              </Link>
                            </h4>
                            <h3>
                              <span>1 × </span>
                              Rs.3500.00
                            </h3>
                          </div>
                          <div className="shopping-cart-delete">
                            <Link href="/#">
                              <i className="fi-rs-cross-small"></i>
                            </Link>
                          </div>
                        </li>
                      </ul>
                      <div className="shopping-cart-footer">
                        <div className="shopping-cart-total">
                          <h4>
                            Total
                            <span>Rs.383.00</span>
                          </h4>
                        </div>
                        <div className="shopping-cart-button">
                          <Link href="/shop-cart">View cart</Link>
                          <Link href="/shop-checkout">Checkout</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

const mapStateToProps = (state) => ({
  totalCartItems: state.cart.length,
  totalCompareItems: state.compare.items.length,
  totalWishlistItems: state.wishlist.items.length,
});

export default connect(mapStateToProps, null)(Header);
