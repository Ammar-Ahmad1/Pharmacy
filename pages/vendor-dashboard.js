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
import Link from "next/link";

// icons
import { BsFillTrashFill } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const ProductsFullWidth = ({ products, productFilters, fetchProduct, cartItems }) => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [sortDate, setSortDate] = useState(true);
    const [sortStatus, setSortStatus] = useState(true);
    const [collapsedRows, setCollapsedRows] = useState({});

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
            Router.push("/page-login")
        }
        else if (session.user.role === "customer") {
            Router.push("/")
        }
        else if (session.user.role === "vendor") {
            getOrders();
        }
    }, [session]);

    const getOrders = async () => {
        const res = await fetch(`/api/order`);
        const data = await res.json();
        console.log(data.data)
        setOrders(data.data);
    }

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
        if (sortDate) {
            setSortDate(false);
            setSortStatus(false);
        } else {
            setSortDate(true);
            setSortStatus(true);
        }
    }
    const handleSortStatus = () => {
        if (!sortStatus) {
            setSortStatus(true);
            setSortDate(true);
        } else {
            setSortStatus(false);
            setSortDate(false);
        }
    }

    // collapsing table
    const toggleCollapse = (rowId) => {
        setCollapsedRows((prevState) => ({
            ...prevState,
            [rowId]: !prevState[rowId],
        }));
    };


    const price = () => {
        let price = 0;
        cartItems.forEach((item) => (price += item.price * item.quantity));

        return price;
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
                                            <Link className="btn btn-fill-out hover: font-weight-bold" href={"/add-item"}>Add Item</Link>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Order
                                                        </th>
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
                                                        <th>
                                                            Total
                                                        </th>
                                                        <th>
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        orders?.map((order, i) => (
                                                            <tr key={i}>
                                                                <td>{order.orderNumber}</td>
                                                                <td>{
                                                                    order.date.split("T")[0]
                                                                }</td>
                                                                <td>{order.status ? "Completed" : "Processing"}</td>
                                                                <td>Rs.{order.totalAmount}</td>
                                                                <td className="d-flex justify-content-between">
                                                                    <Link className="btn-small d-block" href={`/order/${order._id}`}>
                                                                        View
                                                                    </Link>
                                                                    <Link href={`/order/${order._id}`}>
                                                                        <BsFillTrashFill />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))

                                                    }
                                                    {/* {
                                                        orders?.map((order, i) => (
                                                            <React.Fragment key={i}>
                                                                <tr>
                                                                    <td>{order.orderNumber}</td>
                                                                    <td>{
                                                                        order.date.split("T")[0]
                                                                    }</td>
                                                                    <td>{order.status ? "Completed" : "Processing"}</td>
                                                                    <td>Rs.{order.totalAmount}</td>
                                                                    <td className="d-flex justify-content-between">
                                                                        <Link className="btn-small d-block" href={`/order/${order._id}`}>
                                                                            View
                                                                        </Link>
                                                                        <span
                                                                            className="p-1 bg-primary"
                                                                            onClick={() => toggleCollapse(1)}
                                                                        >
                                                                            {collapsedRows[1] ? '-' : '+'}
                                                                        </span>
                                                                        <Link href={`/order/${order._id}`}>
                                                                            <BsFillTrashFill />
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                                {collapsedRows[1] && (
                                                                        cartItems.map((item, i) => (
                                                                            <tr key={i}>
                                                                                <td className="image product-thumbnail">
                                                                                    <img src={item.images ? item.images[0]?.img : item.image} />
                                                                                </td>

                                                                                <td className="product-des product-name">
                                                                                    <h6 className="product-name">
                                                                                        <Link href="/products">{item.title || item.name}</Link>
                                                                                    </h6>
                                                                                    <div className="product-rate-cover">
                                                                                        <div className="product-rate d-inline-block">
                                                                                            <div
                                                                                                className="product-rating"
                                                                                                style={{
                                                                                                    width: "90%"
                                                                                                }}
                                                                                            ></div>
                                                                                        </div>
                                                                                        <span className="font-small ml-5 text-muted"> (4.0)</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="price" data-title="Price">
                                                                                    <h4 className="text-brand">Rs.{item.price}</h4>
                                                                                </td>
                                                                                <td className="text-center detail-info" data-title="Stock">
                                                                                    <div className="detail-extralink mr-15">
                                                                                        <div className="detail-qty border radius ">
                                                                                            <a onClick={(e) => decreaseQuantity(item._id)} className="qty-down">
                                                                                                <i className="fi-rs-angle-small-down"></i>
                                                                                            </a>
                                                                                            <span className="qty-val">{item.quantity}</span>
                                                                                            <a onClick={(e) => increaseQuantity(item._id)} className="qty-up">
                                                                                                <i className="fi-rs-angle-small-up"></i>
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="text-right" data-title="Cart">
                                                                                    <h4 className="text-body">Rs.{item.quantity * item.price}</h4>
                                                                                </td>
                                                                                <td className="action" data-title="Remove">
                                                                                    <a onClick={(e) => deleteFromCart(item._id)} className="text-muted">
                                                                                        <i className="fi-rs-trash"></i>
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                    } */}



                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="primary-sidebar">
                                            <div className="sidebar-widget product-sidebar mt-15 p-30 bg-grey border-radius-10">
                                                <h5 className="section-title style-1 mb-30">Best sell</h5>
                                                <div className="product-list-small">
                                                    <BestSellerSlider />
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
                                            <strong className="text-brand">{products.items.length}</strong>
                                            items for you!
                                        </p>
                                    </div>
                                    <div className="sort-by-product-area">
                                        <div className="sort-by-cover mr-10">
                                            <ShowSelect selectChange={selectChange} showLimit={showLimit} />
                                        </div>
                                        <div className="sort-by-cover">
                                            <SortSelect />
                                        </div>
                                    </div>
                                </div>

                                <div className="row product-grid-3">
                                    {getPaginatedProducts.length === 0 && <h3>No Products Found </h3>}

                                    {getPaginatedProducts.map((item, i) => (
                                        <div className="col-lg-1-5 col-md-4 col-12 col-sm-6" key={i}>
                                            <SingleProduct product={item} />
                                            {/* <SingleProductList product={item}/> */}
                                        </div>
                                    ))}
                                </div>

                                <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
                                    <nav aria-label="Page navigation example">
                                        <Pagination getPaginationGroup={getPaginationGroup} currentPage={currentPage} pages={pages} next={next} prev={prev} handleActive={handleActive} />
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <WishlistModal />
                <QuickView />
            </Layout >
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
