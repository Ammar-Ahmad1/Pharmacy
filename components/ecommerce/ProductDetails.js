import { useState,useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import ProductTab from "../elements/ProductTab";
import RelatedSlider from "../sliders/Related";
import ThumbSlider from "../sliders/Thumb";
import {useSession} from 'next-auth/react'

const ProductDetails = ({
  product,
  cartItems,
  addToCompare,
  addToCart,
  addToWishlist,
  increaseQuantity,
  decreaseQuantity,
  quickView,
}) => {
  const [quantity, setQuantity] = useState(1);
  const {data:session} = useSession();
  const handleCart = (product) => {
    addToCart(product);
    toast("Product added to Cart !");
  };

  const handleCompare = (product) => {
    addToCompare(product);
    toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product);
    toast("Added to Wishlist !");
  };
  const [check,setCheck] = useState(false)
  useEffect (()=>{
    if(session){
        if(session.user.role === 'vendor'){
            setCheck(true)
        }
    }
    else{
        setCheck(false)
    }
  },[session])
  const inCart = cartItems.find((cartItem) => cartItem._id === product._id);

  // Size Selection
  // const [selectedSize, setSelectedSize] = useState('');

  // const handleSizeChange = (event) => {
  //   setSelectedSize(event.target.value);
  // };
  const [activeButton, setActiveButton] = useState('Packs'); // Initialize the active button

  // Function to handle button click and update activeButton state
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  return (
    <>
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="row flex-row-reverse">
            <div className="col-xl-10 col-lg-12 m-auto">
              <div className="product-detail accordion-detail">
                <div className="row mb-50  mt-30">
                  <div className="col-md-4 m-auto col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                    <div className="detail-gallery">
                      <span className="zoom-icon">
                        <i className="fi-rs-search"></i>
                      </span>

                      <div className="product-image-slider">
                        <ThumbSlider product={product} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="detail-info  pr-30 pl-30">
                      <span className="stock-status out-stock"> Sale Off </span>
                      <h2 className="title-detail">{product.name}</h2>
                      <div className="product-detail-rating">
                        <div className="product-rate-cover text-end">
                          <div className="product-rate d-inline-block">
                            <div
                              className="product-rating"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                          <span className="font-small ml-5 text-muted">
                            {" "}
                            (31 reviews)
                          </span>
                        </div>
                      </div>
                      <div className="clearfix product-price-cover">
                        <div className="product-price primary-color float-left">
                          <span className="current-price text-brand">
                            Rs.{
                              product.type === "Tablet" && activeButton === "Strips"
                                ? product.price/product.strips[0]?.stripCountInPack
                                : product.type === "Tablet" && activeButton === "Packs"
                                ? product.price
                                : product.price

                            } 
                            {/* Rs. {product.price} */}
                          </span>
                          <span>
                            <span className="save-price font-md color3 ml-15">
                              {product.discount?.percentage}% Off
                            </span>
                            <span className="old-price font-md ml-15">
                              {product.oldPrice
                                ? `Rs. ${product.oldPrice}`
                                : null}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="save-price font-lg mr-15">
                          Formula/Salt:
                        </span>
                        <span className="font-md ml-4">{product.Salt}</span>
                      </div>

                      <div className="mb-4">
                        <span className="save-price mr-15">
                          Medicine Brand:
                        </span>
                        <span className="font-lg">{product.Company}</span>
                      </div>
                      <div className="mb-4">
                        <span className="save-price mr-15">Type:</span>
                        <span className="font-lg">{product.type}</span>
                      </div>

                      <div className="short-desc mb-30">
                        <p className="font-lg">{product.Use}</p>
                      </div>

                      {product.type === 'Tablet' ? (
        <div className="mb-4">
          <button
            className={`button button-outline button-primary ${
              activeButton === 'Strips' ? 'active' : ''
            }`}
            onClick={() => handleButtonClick('Strips')}
          >
            Strips
          </button>
          <button
            className={`button button-outline button-primary ${
              activeButton === 'Packs' ? 'active' : ''
            }`}
            onClick={() => handleButtonClick('Packs')}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          >
            Packs
          </button>
        </div>
      ) : null}


                      <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                      <div className="detail-extralink"
                      style = {{display:!check ? 'block' : 'none'}}
                      >
                        <div className="detail-qty border radius">
                          <a
                            onClick={(e) =>
                              !inCart
                                ? setQuantity(quantity > 1 ? quantity - 1 : 1)
                                : decreaseQuantity(product._id)
                            }
                            className="qty-down"
                          >
                            <i className="fi-rs-angle-small-down"></i>
                          </a>
                          <span className="qty-val">
                            {inCart?.quantity || quantity}
                          </span>
                          <a
                            onClick={() =>
                              !inCart
                                ? setQuantity(quantity + 1)
                                : increaseQuantity(product._id)
                            }
                            className="qty-up"
                          >
                            <i className="fi-rs-angle-small-up"></i>
                          </a>
                        </div>

                        <div className="product-extra-link2">
                          <button
                            onClick={(e) =>
                              handleCart({
                                ...product,
                                quantity: quantity || 1,
                              })
                            }
                            className="button button-add-to-cart"
                          >
                            Add to cart
                          </button>
                          <a
                            aria-label="Add To Wishlist"
                            className="action-btn hover-up"
                            onClick={(e) => handleWishlist(product)}
                          >
                            <i className="fi-rs-heart"></i>
                          </a>
                          <a
                            aria-label="Compare"
                            className="action-btn hover-up"
                            onClick={(e) => handleCompare(product)}
                          >
                            <i className="fi-rs-shuffle"></i>
                          </a>
                        </div>
                      </div>
                      <ul className="product-meta font-xs color-grey mt-50">
                        {/* <li className="mb-5">
                            SKU:
                            <a href="#">FWM15VKT</a>
                          </li>
                          <li className="mb-5">
                            Tags:
                            <a href="#" rel="tag" className="me-1">
                              Cloth,
                            </a>
                          </li> */}
                        <li>
                          Availability:
                          <span className="in-stock text-success ml-5">
                            {product.stock} Items In Stock
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {product.stock === 0 ? (
                  <div className="row mt-60">
                    <div className="col-12">
                      <h3 className="section-title style-1 mb-30">
                        Similar products
                      </h3>
                    </div>
                    <div className="col-12">
                      <div className="row related-products position-relative">
                        <RelatedSlider />
                      </div>
                    </div>
                  </div>
                ) : null}
                {quickView ? null : (
                  <>
                    <ProductTab product={product} />
                    <div className="row mt-60">
                      <div className="col-12">
                        <h3 className="section-title style-1 mb-30">
                          Related products
                        </h3>
                      </div>
                      <div className="col-12">
                        <div className="row related-products position-relative">
                          <RelatedSlider />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
});

const mapDispatchToProps = {
  addToCompare,
  addToWishlist,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
