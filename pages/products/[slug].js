import React,{useEffect,useState} from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from '../../components/layout/Layout';
import { toast } from "react-toastify";
import { server } from "../../config/index";
import { useRouter } from "next/router";
import { findProductIndex } from "../../util/util";

const ProductId = ({initialProduct}) => {
    const [product, setProduct] = useState(initialProduct);
    const router = useRouter();
  
    useEffect(() => {
      // Fetch and update the product data whenever the route changes
      const fetchProductData = async () => {
        const res = await fetch(`/api/medicine`);
        const newProduct = await res.json();
        const index = findProductIndex(newProduct.data, router.query.slug);
        setProduct(newProduct.data[index]);
        // setProduct(newProduct);
      };
  
      fetchProductData();
    }, [router.query.slug]);
    
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
    
    const req= await fetch(`/api/medicine`, {
        method: "GET",
    }

        );
    const allProducts = await req.json();
    const all = allProducts.data;
    const index = findProductIndex(all, params.query.slug);
    return { initialProduct: all[index] }; 
};


export default ProductId;
