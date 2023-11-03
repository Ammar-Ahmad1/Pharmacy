import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import { server } from "../../config/index";
import { useRouter } from "next/router";
import { findProductIndex } from "../../util/util";

const ProductId = ({ initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);
  const router = useRouter();

  const fetchProductData = async () => {
    try {
      const res = await fetch(`/api/medicine`);
      if (!res.ok) {
        throw new Error("Failed to fetch product data");
      }
      const newProduct = await res.json();
      const index = findProductIndex(newProduct.data, router.query.slug);
      setProduct(newProduct.data[index]);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("An error occurred while fetching product data");
    }
  };

  useEffect(() => {
    // Fetch and update the product data whenever the route changes
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
  try {
    const req = await fetch(`/api/medicine`, {
      method: "GET",
    });

    if (!req.ok) {
      throw new Error("Failed to fetch initial product data");
    }

    const allProducts = await req.json();
    const all = allProducts.data;
    const index = findProductIndex(all, params.query.slug);
    return { initialProduct: all[index] };
  } catch (error) {
    console.error("Error fetching initial product data:", error);
    toast.error("An error occurred while fetching initial product data");
    return { initialProduct: {} }; // Return an empty object or appropriate default value
  }
};

export default ProductId;