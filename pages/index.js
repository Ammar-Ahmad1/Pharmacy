import Link from "next/link";
import CategoryTab from "../components/ecommerce/categoryTab";
import FetchDeals from "../components/ecommerce/fetchDeals";
import Layout from "../components/layout/Layout";
import Intro2 from "../components/sliders/Intro2";
import FetchTabSlider from "../components/ecommerce/fetchTabSlider";
import Banner5 from "../components/elements/Banner5";
import Bottom from "../components/elements/Bottom";
import CategorySlider2 from "../components/sliders/Category2";
import IntroPopup from "./../components/elements/IntroPopup";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Index2() {

    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        router.push({
            pathname: "/products",
            query: {
                search: searchTerm,
            },
        });
        setSearchTerm("");
    };

    const handleInput = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <>
            {/* <IntroPopup /> */}
            <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
                <section className="home-slider style-2 position-relative mb-20">
                    <div className="container">
                        <div className="mobile-search search-style-3 mobile-header-border col-10 m-auto mb-20 d-block d-lg-none">
                            <form action="#">
                                <input
                                    value={searchTerm}
                                    onKeyDown={handleInput}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type="text"
                                    placeholder="Search Products"
                                />
                                <button type="submit">
                                    <i className="fi-rs-search"></i>
                                </button>
                            </form>
                        </div>
                        <div className="row">
                            <div className="col-xl-8 col-lg-12">
                                <div className="home-slide-cover">
                                    <Intro2 />
                                </div>
                            </div>

                            <div className="col-lg-4 d-none d-xl-block">
                                <div className="banner-img style-3 animated animated">
                                    <div className="banner-text mt-50">
                                        <h2 className="mb-50">
                                            Delivered <br />
                                            to
                                            <span className="text-brand">
                                                your
                                                <br />
                                                home
                                            </span>
                                        </h2>
                                        <Link href="/shop-grid-right" className="btn btn-xs">
                                            Shop Now <i className="fi-rs-arrow-small-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="banners mb-15">
                    <div className="container">
                        <div className="row">
                            <Banner5 />
                        </div>
                    </div>
                </section>

                <section className="product-tabs section-padding position-relative">
                    <div className="container">
                        <div className="row">
                            <div className="mobile-search search-style-3 mobile-header-border col-10 m-auto mb-20 d-block d-lg-none">
                                <form action="#">
                                    <input
                                        value={searchTerm}
                                        onKeyDown={handleInput}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        type="text"
                                        placeholder="Search Products"
                                    />
                                    <button type="submit">
                                        <i className="fi-rs-search"></i>
                                    </button>
                                </form>
                            </div>
                            <div className="col-lg-12">
                                <CategoryTab />
                            </div>
                        </div>
                    </div>
                </section>
                

                <section className="section-padding pb-5">
                    <div className="container">
                        {/* <FetchTabSlider /> */}
                    </div>
                </section>
                <Bottom />
            </Layout>
        </>
    );
}

export default Index2;
