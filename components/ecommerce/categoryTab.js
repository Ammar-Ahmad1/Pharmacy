import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import Cat1Tab from "../elements/FeaturedTab";
import Cat2Tab from "../elements/NewArrivalTab";
import Cat3Tab from "../elements/TrendingTab";
import Link from "next/link";

function CategoryTab() {
  const [active, setActive] = useState("1");
  const [catAll, setCatAll] = useState([]);
  const [cat1, setCat1] = useState([]);
  const [cat2, setCat2] = useState([]);
  const [cat3, setCat3] = useState([]);
  const [loading, setLoading] = useState(true);
  const catPAll = async () => {
    try {
      setLoading(true);
      const request = await fetch(`/api/medicine`);
      const allProducts = await request.json();
      console.log(allProducts);
      // const catAllItem = allProducts.filter((item) => item.Categories);
      setCatAll(allProducts.data);
      setActive("1");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const catP1 = async () => {
    try {
      setLoading(true);
      const request = await fetch(`/api/medicine`);
      const allProducts = await request.json();
      console.log(allProducts);
      const cat1Item = allProducts.data.filter(
        (item) => item.category === "Dermatologicals"
      );
      console.log(cat1Item);
      setCat1(cat1Item);
      setActive("2");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const catP2 = async () => {
    try {
      setLoading(true);
      const request = await fetch(`/api/medicine`);
      const allProducts = await request.json();
      const cat2Item = allProducts.data.filter(
        (item) =>
          // filter popular products
          item.totalSell > 25
      );
      setCat2(cat2Item);
      console.log(cat2Item);
      setActive("3");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const catP3 = async () => {
    try {
      setLoading(true);
      const request = await fetch(`/api/medicine`);
      const allProducts = await request.json();
      const cat3Item = allProducts.data.filter(
        (item) =>
          // filter new products
          item.created > new Date("2021-01-01")
      );
      setCat3(cat3Item);
      setActive("4");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    catPAll();
  }, []);

  return (
    <>
      <div className="section-title style-2 wow animate__animated animate__fadeIn">
        <h3>Popular Products</h3>
        <ul className="nav nav-tabs links" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={active === "1" ? "nav-link active" : "nav-link"}
              onClick={catPAll}
            >
              All
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "2" ? "nav-link active" : "nav-link"}
              onClick={catP1}
            >
              Featured/Allergy
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "3" ? "nav-link active" : "nav-link"}
              onClick={catP2}
            >
              Popular
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "4" ? "nav-link active" : "nav-link"}
              onClick={catP3}
            >
              New added
            </button>
          </li>
        </ul>
      </div>

      {/* {loading ? (
        <div className="text-center">
          <img src="/assets/imgs/theme/loading2.gif" alt="loading" />
        </div>
      ) : ( */}
        <div className="tab-content wow fadeIn animated">
          <div
            className={
              active === "1" ? "tab-pane fade show active" : "tab-pane fade"
            }
          >
            <div className="product-grid-4 row">
              <Cat1Tab products={catAll} />
            </div>
          </div>

          <div
            className={
              active === "2" ? "tab-pane fade show active" : "tab-pane fade"
            }
          >
            <div className="product-grid-4 row">
              <Cat1Tab products={cat1} />
            </div>
          </div>

          <div
            className={
              active === "3" ? "tab-pane fade show active" : "tab-pane fade"
            }
          >
            <div className="product-grid-4 row">
              <Cat3Tab products={cat2} />
            </div>
          </div>
          <div
            className={
              active === "4" ? "tab-pane fade show active" : "tab-pane fade"
            }
          >
            <div className="product-grid-4 row">
              <Cat2Tab products={cat3} />
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
}
export default CategoryTab;
