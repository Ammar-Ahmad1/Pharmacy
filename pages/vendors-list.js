import Link from "next/link";
import React from "react";
import Layout from "../components/layout/Layout";
import data from "../util/storeData";

const Blank = () => {
    return (
        <>
            <Layout pageclassName="pageclass" parent="Home" child="Stores">
                <div className="page-content pt-50">
                    <div className="container">
                        <div className="archive-header-2 text-center">
                            <h1 className="display-2 mb-50">Vendors List</h1>
                            <div className="row">
                                <div className="col-lg-5 mx-auto">
                                    <div className="sidebar-widget-2 widget_search mb-50">
                                        <div className="search-form">
                                            <form action="#">
                                                <input type="text" placeholder="Search vendors (by name or ID)..." />
                                                <button type="submit">
                                                    <i className="fi-rs-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-50">
                            <div className="col-12 col-lg-8 mx-auto">
                                <div className="shop-product-fillter">
                                    <div className="totall-product">
                                        <p>
                                            We have <strong className="text-brand">780</strong> vendors now
                                        </p>
                                    </div>
                                    <div className="sort-by-product-area">
                                        <div className="sort-by-cover mr-10">
                                            <div className="sort-by-product-wrap">
                                                <div className="sort-by">
                                                    <span>
                                                        <i className="fi-rs-apps"></i>Show:
                                                    </span>
                                                </div>
                                                <div className="sort-by-dropdown-wrap">
                                                    <span>
                                                        {" "}
                                                        50 <i className="fi-rs-angle-small-down"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="sort-by-dropdown">
                                                <ul>
                                                    <li>
                                                        <a className="active" href="#">
                                                            50
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">100</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">150</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">200</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">All</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="sort-by-cover">
                                            <div className="sort-by-product-wrap">
                                                <div className="sort-by">
                                                    <span>
                                                        <i className="fi-rs-apps-sort"></i>Sort by:
                                                    </span>
                                                </div>
                                                <div className="sort-by-dropdown-wrap">
                                                    <span>
                                                        {" "}
                                                        Featured <i className="fi-rs-angle-small-down"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="sort-by-dropdown">
                                                <ul>
                                                    <li>
                                                        <a className="active" href="#">
                                                            Mall
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Featured</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Preferred</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Total items</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Avg. Rating</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row vendor-grid">
                            {data.map((item, i) => (
                                <div className="col-lg-6 col-md-6 col-12 col-sm-6 mb-50" key={i}>
                                    <div className="vendor-wrap mb-40  style-2">
                                        <div className="product-badges product-badges-position product-badges-mrg">
                                            <span className="hot">Mall</span>
                                        </div>
                                        <div className="vendor-img-action-wrap">
                                            <div className="vendor-img">
                                                <Link href={`vendor/${item.id}`}>
                                                    <img className="default-img" src={`assets/imgs/vendor/${item.img}`} alt="nest" />
                                                </Link>
                                            </div>

                                            <div className="mt-10">
                                                <span className="font-small total-product">380 products</span>
                                            </div>
                                        </div>
                                        <div className="vendor-content-wrap">
                                            <div className="mb-30">
                                                <div className="product-category">
                                                    <span className="text-muted">Since 2012</span>
                                                </div>
                                                <h4 className="mb-5">
                                                    <Link href={`vendor/${item.id}`}>{item.title}</Link>
                                                </h4>

                                                <div className="product-rate-cover">
                                                    <div className="product-rate d-inline-block">
                                                        <div className="product-rating" style={{ width: "90%" }}></div>
                                                    </div>
                                                    <span className="font-small ml-5 text-muted"> (4.0)</span>
                                                </div>
                                                <div className="vendor-info d-flex justify-content-between align-items-end mt-30">
                                                    <ul className="contact-infor text-muted">
                                                        <li>
                                                            <img src="/assets/imgs/theme/icons/icon-location.svg" alt="nest" />
                                                            <strong>Address: </strong> <span>5171 W Campbell Ave undefined Kent, Utah 53127 United States</span>
                                                        </li>
                                                        <li>
                                                            <img src="/assets/imgs/theme/icons/icon-contact.svg" alt="nest" />
                                                            <strong>Call Us:</strong>
                                                            <span>(+91) - 540-025-124553</span>
                                                        </li>
                                                    </ul>
                                                    <Link href={`vendor/${item.id}`} className="btn btn-xs">
                                                        Visit Store <i className="fi-rs-arrow-small-right"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination-area mt-20 mb-20">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-start">
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            <i className="fi-rs-arrow-small-left"></i>
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            1
                                        </a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="#">
                                            2
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            3
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link dot" href="#">
                                            ...
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            6
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            <i className="fi-rs-arrow-small-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Blank;
