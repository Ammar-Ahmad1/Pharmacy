import Link from "next/link";
import React,{useEffect,useState} from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import { BsFillTrashFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image'

const SingleProduct = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
  handleMedicineDelete,
}) => {
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
  const router = useRouter();
  const { data: session } = useSession();
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
  const handleDeleteClick = (e) => {
    e.preventDefault();
    // Call the parent's handleMedicineDelete function with the product ID
    handleMedicineDelete(product._id);
  };
  return (
    <>
      <div className="product-cart-wrap d-flex flex-column justify-content-between mb-30">
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            <Link href="/products/[slug]" as={`/products/${product.slug}`}>
              <Image
                className="default-img"
                src={product.image[0]}
                alt="nest"
                loading="lazy"
                width={300}
                height={300}
              />

              <Image
                className="hover-img"
                src={product.image[1]}
                alt="nest"
                loading="lazy"
                width={300}
                height={300}

              />
            </Link>
          </div>
          <div className="product-action-1"
          style = {{display:check ? 'none' : 'block'}}
          >
            {/* <a
              aria-label="Quick view"
              className="action-btn hover-up"
              data-bs-toggle="modal"
              onClick={() => openQuickView(product)}
            >
              <i className="fi-rs-eye"></i>
            </a> */}
            <a
              aria-label="Add To Wishlist"
              className="action-btn hover-up"
              onClick={() => handleWishlist(product)}
            >
              <i className="fi-rs-heart"></i>
            </a>
            <a
              aria-label="Compare"
              className="action-btn hover-up"
              onClick={() => handleCompare(product)}
            >
              <i className="fi-rs-shuffle"></i>
            </a>
          </div>

          <div className="product-badges product-badges-position product-badges-mrg">
            {product.trending && <span className="hot">Hot</span>}
            {product.created && <span className="new">New</span>}
            {product.totalSell > 100 && <span className="best">Best Sell</span>}
            {product.discount?.isActive && <span className="sale">Sale</span>}
            {product.discount?.percentage >= 5 && (
              <span className="hot">{product.discount.percentage}%</span>
            )}
          </div>
        </div>
        <div className="product-content-wrap">
          <div className="product-category">
            <Link href="/products">{product.Company}</Link>
          </div>
          <h2>
            <div  
            style ={{
              display:'flex',
              justifyContent:'space-between'
            }}
            >
            <Link href="/products/[slug]" as={`/products/${product.slug}`}>
              {product.name}
            </Link>

            <Link
              href="#"
              onClick={handleDeleteClick}
            >
              <BsFillTrashFill 
                style = {{display:check ? 'block' : 'none',
                color:'red',
            }}

              />
            </Link>
            </div>
          </h2>
          <span className="font-small text-muted"> {product.category} </span>
          <div className="product-rate-cover">
          
            <div className="product-rate d-inline-block">
              <div className="product-rating" style={{ width: "90%" }}></div>
            </div>
            
            <span className="font-small ml-5 text-muted">
              {" "}
              ({product.ratingScore})
            </span>
          </div>

          <div>
            <span className="font-small text-muted">
              By <Link href="/vendor/1">pharmacy</Link>
            </span>
          </div>

          <div className="product-card-bottom">
            <div className="product-price">
              <span>Rs. {product.price} </span>
              <span className="old-price">
                {product.oldPrice && `Rs.  ${product.oldPrice}`}
              </span>
            </div>
            
            <div className="add-cart"
            style = {{display:!check ? 'block' : 'none'}}
            >
              <a className="add" onClick={(e) => handleCart(product)}
              
              >
                <i className="fi-rs-shopping-cart mr-5"></i><span className="d-none d-md-inline">Add</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
};

export default connect(null, mapDispatchToProps)(SingleProduct);
