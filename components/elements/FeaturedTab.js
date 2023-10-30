import React from "react";
import SingleProduct from "../ecommerce/SingleProduct";

const FeaturedTab = ({ products,handleMedicineDelete}) => {
  const showItem = 10;
  const loading = products.length === 0;

  return (
    <>
      {loading ? (
        // Loading state: Show a loading indicator
        <div>Loading...</div>
      ) : (
        products.slice(0, showItem).map((product, i) => (
          <div className="col-lg-1-5 col-md-4 col-12 col-sm-6" key={i}>
            <SingleProduct product={product} handleMedicineDelete={handleMedicineDelete}/>
          </div>
        ))
      )}
    </>
  );
};

export default FeaturedTab;
