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


function Index2() {
    return (
        <>
            {/* <IntroPopup /> */}
            <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
                <section className="home-slider style-2 position-relative mb-50">
                    <div className="container">
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
                            <div className="col-lg-12">
                                <CategoryTab />
                            </div>
                        </div>
                    </div>
                </section>
                {/* <section className="banner-2 section-padding pb-0">
                    <div className="container">
                        <Banner2 />
                    </div>
                </section> */}

                <section className="section-padding pb-5">
                    <div className="container">
                        <FetchTabSlider />
                    </div>
                </section>
                <Bottom />
            </Layout>
        </>
    );
}

export default Index2;
