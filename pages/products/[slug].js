import React from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from '../../components/layout/Layout';
import { server } from "../../config/index";
import { findProductIndex } from "../../util/util";

const ProductId = ({ product }) => {
    console.log(product);
    return (
        <>
        <Layout parent="Home" sub="Shop" subChild={product.name}>
            <div className="container">
                <ProductDetails product={product} />
            </div>
        </Layout>
        </>
    );
};



ProductId.getInitialProps = async (params) => {
    
    const req= await fetch(`api/medicine`);
    const allProducts = await req.json();
    console.log(allProducts)
    const all = allProducts.data;
    all.filter((item) => item.Slug == params.query.slug);

    return { product: all[0] }; 
    
    // const request = await fetch(`${server}/static/product.json`);
    // const data = await request.json();
    
    // const index = findProductIndex(data, params.query.slug);
    // // console.log(params);

    // return { product: data[index] };
};

export default ProductId;
