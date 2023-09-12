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

    const [currentOrder, setCurrentOrder] = useState(null);
    // const [orders, setOrders] = useState([]);
    const [orders, setOrders] = useState(null);
    const { data: session } = useSession();
    const [sortDate, setSortDate] = useState(true);
    const [sortStatus, setSortStatus] = useState(true);

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
    

    // const getOrders = async () => {
    //     const res = await fetch(`/api/order`);
    //     const data = await res.json();
    //     console.log(data.data)
    //     setOrders(data.data);
    // }

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
    }, [session]);

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
                                                                    <Link
                                                                        href="#"
                                                                        className="btn-small d-block"
                                                                        onClick={(e) => {
                                                                            handleToggleOrderDetails(e, order); // Call the function to toggle order details
                                                                        }}
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <Link href="#">
                                                                        <BsFillTrashFill />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                            {/* Conditionally render order details */}
                                                            {currentOrder === order && (
                                                                <tr>
                                                                    <td colSpan="5">
                                                                        <div className="order-details">
                                                                            {/* Display order details here */}
                                                                            <h3> Items in Order</h3>
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
                                                                                                <Link href="/products/[slug]" as={`/products/${item.medicine.slug}`}>
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
