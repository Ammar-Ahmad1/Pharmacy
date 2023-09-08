import Link from "next/link";
import React, { useEffect, useState } from "react";
import SwiperCore, { Navigation } from "swiper";
import { fetchByCatagory } from "../../redux/action/product";

SwiperCore.use([Navigation]);

const TopRatedSlider = () => {
    const [discount, setDiscount] = useState([]);

    // console.log(discount);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // With Category
        const allProducts = await fetchByCatagory("/api/medicine");

        // Discount
        const discountProduct = allProducts.filter((item) => item.discount.isActive);

        setDiscount(discountProduct);
    };
    return (
        <>
            {discount.slice(0, 3).map((product, i) => (
                <article className="row align-items-center hover-up" key={i}>
                    <figure className="col-md-4 mb-0">
                        <Link href="/products/[slug]" as={`/products/${product.slug}`}>
                            <img src={product.images?product.images[0].img:product.image} alt="nest" />
                        </Link>
                    </figure>
                    <div className="col-md-8 mb-0">
                        <h6>
                            <Link href="/products/[slug]" as={`/products/${product.slug}`}>
                                {product.title||product.name}
                            </Link>
                        </h6>
                        <div className="product-rate-cover">
                            <div className="product-rate d-inline-block">
                                <div className="product-rating" style={{ width: "90%" }}></div>
                            </div>
                            <span className="font-small ml-5 text-muted"> (4.0)</span>
                        </div>
                        <div className="product-price">
                            <span>Rs.{product.price} </span>
                            <span className="old-price">{product.oldPrice && `Rs. ${product.oldPrice}`}</span>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
};

export default TopRatedSlider;
