import Link from "next/link";
import React from "react";

const HomeBlog = () => {
    return (
        <div>
            <div className="post-list mb-4 mb-lg-0">
                <article className="wow fadeIn animated">
                    <div className="d-md-flex d-block">
                        <div className="post-thumb d-flex mr-15">
                            <Link href="/blog-post-fullwidth" className="color-white">
                                <img src="/assets/imgs/blog/blog-2.jpg" alt="nest" />
                            </Link>
                        </div>
                        <div className="post-content">
                            <div className="entry-meta mb-10 mt-10">
                                <Link href="/blog-category-fullwidth" className="entry-meta meta-2">
                                    <span className="post-in font-x-small">Fashion</span>
                                </Link>
                            </div>
                            <h4 className="post-title mb-25 text-limit-2-row">
                                <Link href="/blog-post-fullwidth">Qualcomm is developing a Nintendo Switch-like console, report says</Link>
                            </h4>
                            <div className="entry-meta meta-1 font-xs color-grey mt-10 pb-10">
                                <div>
                                    <span className="post-on">14 April 2024</span>
                                    <span className="hit-count has-dot">12M Views</span>
                                </div>
                                <Link href="/blog-post-right">Read More</Link>
                            </div>
                        </div>
                    </div>
                </article>
                <article className="wow fadeIn animated">
                    <div className="d-md-flex d-block">
                        <div className="post-thumb d-flex mr-15">
                            <Link href="/blog-post-fullwidth" className="color-white">
                                <img src="/assets/imgs/blog/blog-1.jpg" alt="nest" />
                            </Link>
                        </div>
                        <div className="post-content">
                            <div className="entry-meta mb-10 mt-10">
                                <Link href="/blog-category-fullwidth" className="entry-meta meta-2">
                                    <span className="post-in font-x-small">Healthy</span>
                                </Link>
                            </div>
                            <h4 className="post-title mb-25 text-limit-2-row">
                                <Link href="/blog-post-fullwidth">Not even the coronavirus can derail 5G's global momentum</Link>
                            </h4>
                            <div className="entry-meta meta-1 font-xs color-grey mt-10 pb-10">
                                <div>
                                    <span className="post-on">14 April 2024</span>
                                    <span className="hit-count has-dot">12M Views</span>
                                </div>
                                <Link href="/blog-post-right">Read More</Link>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default HomeBlog;
