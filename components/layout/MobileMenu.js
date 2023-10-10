import Link from "next/link";
import { useState } from "react";
import useClickOutside from "../../util/outsideClick";
import { useRouter } from "next/router";
import { updateProductCategory } from "@redux/action/productFiltersAction";
const MobileMenu = ({ isToggled, toggleClick }) => {
  const router = useRouter();

  const [isActive, setIsActive] = useState({
    status: false,
    key: "",
  });

  const handleToggle = (key) => {
    if (isActive.key === key) {
      setIsActive({
        status: false,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };

  let domNode = useClickOutside(() => {
    setIsActive({
      status: false,
    });
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };
  const selectCategory = (e, category) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(category);
    router.push({
      pathname: "/products",
      query: {
        cat: category, //
      },
    });
  };

  return (
    <>
      <div
        className={
          isToggled
            ? "mobile-header-active mobile-header-wrapper-style sidebar-visible"
            : "mobile-header-active mobile-header-wrapper-style"
        }
      >
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-top">
            <div className="mobile-header-logo">
              <Link href="/">
                <img src="/assets/imgs/oxygenGreen.svg" alt="logo" />
              </Link>
            </div>
            <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
              <button
                className="close-style search-close"
                onClick={toggleClick}
              >
                <i className="icon-top"></i>
                <i className="icon-bottom"></i>
              </button>
            </div>
          </div>
          <div className="mobile-header-content-area">
            <div className="mobile-search search-style-3 mobile-header-border">
              <form action="#">
                <input type="text" placeholder="Search for items…" />
                <button type="submit">
                  <i className="fi-rs-search"></i>
                </button>
              </form>
            </div>
            <div className="mobile-menu-wrap mobile-header-border">
              <div className="main-categori-wrap mobile-header-border">
                <Link
                  href="#"
                  className="categori-button-active-2"
                  onClick={handleToggleMenu}
                >
                  <span className="fi-rs-apps"></span> Browse Categories
                </Link>
                <div
                  className={`categori-dropdown-wrap categori-dropdown-active-small ${
                    isMenuOpen ? "active" : ""
                  }`}
                >
                  <ul>
                    <li>
                      <div
                        onClick={(e) => {
                          selectCategory(e, "Anti Infective");
                        }}
                      >
                        <i className="evara-font-dress"></i>
                        Anti Infective
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={(e) => {
                          selectCategory(e, "Anti Epileptic");
                        }}
                      >
                        <i className="evara-font-tshirt"></i>
                        Anti Epileptic
                      </div>
                    </li>
                    <li>
                      
                        <div
                            onClick={(e) => {
                                selectCategory(e, "Anti Depressant");
                            }}
                        >
                        <i className="evara-font-anti-depressant"></i>
                        Anti Depressant
                      </div>
                    </li>
                    <li>
                      {" "}
                        <div
                            onClick={(e) => {
                                selectCategory(e, "Alimentary Tract & Metabolism");
                            }}
                        >
                        <i className="evara-font-metabolism"></i> Alimentary
                        Tract & Metabolism
                      </div>
                    </li>
                    <li>
                      {" "}
                            <div
                                onClick={(e) => {
                                    selectCategory(e, "Cardio Vascular System");
                                }}
                            >
                        <i className="evara-font-cardio-vascular-system"></i>{" "}
                        Cardio Vascular System
                      </div>
                    </li>
                    <li>
                        <div
                            onClick={(e) => {
                                selectCategory(e, "Dermatologicals");
                            }}
                        >

                        <i className="evara-font-dermatologicals"></i>
                        Dermatologicals
                      </div>
                    </li>
                    <li>
                            <div
                                onClick={(e) => {
                                    selectCategory(e,"Eyes , Nose , Ear");
                                }}
                            >
                        <i className="evara-font-eyes-notes-ear"></i>
                        Eyes , Nose , Ear
                      </div>
                    </li>
                    <li>
                            <div
                                onClick={(e) => {
                                    selectCategory(e, "Prescription Drugs");
                                }}
                            >

                        <i className="evara-font-prescription-drugs"></i>
                        Prescription Drugs
                      </div>
                    </li>
                    <li>
                            <div
                                onClick={(e) => {
                                    selectCategory(e, "Sensory Organs");    
                                }}
                            >

                        <i className="evara-font-sensory-organs"></i>
                        Sensory Organs
                      </div>
                    </li>
                    <li>
                            <div
                                onClick={(e) => {
                                    selectCategory(e, "Others");
                                }}
                            >

                        <i className="evara-font-sensory-organs"></i>
                        Others
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <nav>
                <ul className="mobile-menu" ref={domNode}>
                  <li
                    className={
                      isActive.key == 1
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <Link href="/">Home</Link>
                  </li>
                  <li
                    className={
                      isActive.key == 2
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <Link href="/shop-grid-left">shop</Link>
                  </li>

                  <li
                    className={
                      isActive.key == 5
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <span
                      className="menu-expand"
                      onClick={() => handleToggle(5)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span>
                    <Link href="#">Pages</Link>
                    <ul className={isActive.key == 5 ? "dropdown" : "d-none"}>
                      <li>
                        <Link href="/page-about">About Us</Link>
                      </li>
                      <li>
                        <Link href="/page-contact">Contact</Link>
                      </li>
                      <li>
                        <Link href="/page-account">My Account</Link>
                      </li>
                      <li>
                        <Link href="/page-login-register">login/register</Link>
                      </li>
                      <li>
                        <Link href="/page-purchase-guide">Purchase Guide</Link>
                      </li>
                      <li>
                        <Link href="/page-privacy-policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href="/page-terms">Terms of Service</Link>
                      </li>
                      <li>
                        <Link href="/page-404">404 Page</Link>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={
                      isActive.key == 6
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <span
                      className="menu-expand"
                      onClick={() => handleToggle(6)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span>
                    <Link href="#">Language</Link>
                    <ul className={isActive.key == 6 ? "dropdown" : "d-none"}>
                      <li>
                        <Link href="#">English</Link>
                      </li>
                      <li>
                        <Link href="#">French</Link>
                      </li>
                      <li>
                        <Link href="#">German</Link>
                      </li>
                      <li>
                        <Link href="#">Spanish</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mobile-header-info-wrap mobile-header-border">
              <div className="single-mobile-header-info mt-30">
                <Link href="/page-contact">Our location</Link>
              </div>
              <div className="single-mobile-header-info">
                <Link href="/page-register">Sign Up</Link>
              </div>
              <div className="single-mobile-header-info">
                <Link href="/page-login">Log In</Link>
              </div>
              <div className="single-mobile-header-info">
                <Link href="#">(+01) - 2345 - 6789</Link>
              </div>
            </div>
            <div className="mobile-social-icon">
              <h5 className="mb-15 text-grey-4">Follow Us</h5>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-facebook.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-twitter.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-instagram.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-pinterest.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-youtube.svg"
                  alt="nest"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
