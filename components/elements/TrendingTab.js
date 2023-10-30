import SwiperCore, { Navigation } from "swiper";
import SingleProduct from "../ecommerce/SingleProduct";

SwiperCore.use([Navigation]);

const TrendingTab = ({ products,handleMedicineDelete }) => {
    const showItem = 10
    return (
        <>
            {products.slice(0, showItem).map((product, i) => (
                <div className="col-lg-1-5 col-md-4 col-12 col-sm-6" key={i}>
                    <SingleProduct product={product} handleMedicineDelete={handleMedicineDelete}/>
                </div>
            ))}
        </>
    );
};

export default TrendingTab;
