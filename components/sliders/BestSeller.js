import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchByCatagory } from "../../redux/action/product";

const BestSellerSlider = () => {
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // With Category
        const allProducts = await fetchByCatagory("/static/product.json");

        // Best Seller
        const bestSellerProducts = allProducts.sort(function (a, b) {
            return a.totalSell > b.totalSell ? -1 : 1;
        });

        setBestSeller(bestSellerProducts);
    };

    return (
        <>
            {bestSeller.slice(0, 3).map((product, i) => (
                <article className="row align-items-center hover-up" key={i}>
                    <figure className="col-md-4 mb-0">
                        <Link href="/products/[slug]" as={`/products/${product.slug}`}>
                            <img src={product.images[0].img} alt="nest" />
                        </Link>
                    </figure>
                    <div className="col-md-8 mb-0">
                        <h6>
                            <Link href="/products/[slug]" as={`/products/${product.slug}`}>
                                {product.title}
                            </Link>
                        </h6>
                        <div className="product-rate-cover">
                            <div className="product-rate d-inline-block">
                                <div className="product-rating" style={{ width: "90%" }}></div>
                            </div>
                            <span className="font-small ml-5 text-muted"> (4.0)</span>
                        </div>
                        <div className="product-price">
                            <span>${product.price} </span>
                            <span className="old-price">{product.oldPrice && `$ ${product.oldPrice}`}</span>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
};

export default BestSellerSlider;
