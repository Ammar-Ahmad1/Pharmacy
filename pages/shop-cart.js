import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";

import Link from "next/link";
import { clearCart, closeCart, decreaseQuantity, deleteFromCart, increaseQuantity, openCart } from "../redux/action/cart";

const Cart = ({ openCart, cartItems, activeCart, closeCart, increaseQuantity, decreaseQuantity, deleteFromCart, clearCart }) => {
    const price = () => {
        let price = 0;
        cartItems.forEach((item) => (price += item.price * item.quantity));

        return price;
    };

    
    const router = useRouter();

    const handleRoute = () => {
        router.push("/shop-checkout");
    }

    return (
        <>
            <Layout parent="Home" sub="Shop" subChild="Cart">
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mb-40">
                                <h1 className="heading-2 mb-10">Your Cart</h1>
                                <div className="d-flex justify-content-between">
                                    <h6 className="text-body">
                                        Carefully check the information before checkout
                                    </h6>
                                    {/* <h6 className="text-body">
                                        <a href="#" className="text-muted">
                                            <i className="fi-rs-trash mr-5"></i>
                                            Clear Cart
                                        </a>
                                    </h6> */}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="table-responsive shopping-summery">
                                    {cartItems.length <= 0 && "No Products"}
                                    <table className={cartItems.length > 0 ? "table table-wishlist" : "d-none"}>
                                        <thead>
                                            <tr className="main-heading">
                                                <th className="custome-checkbox start pl-30" colSpan="2">
                                                    Product
                                                </th>
                                                <th scope="col">Unit Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Subtotal</th>
                                                <th scope="col" className="end">
                                                    Remove
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="image product-thumbnail">
                                                        <img src={item.images? item.images[0]?.img : item.image} />
                                                    </td>

                                                    <td className="product-des product-name">
                                                        <h6 className="product-name">
                                                            <Link href="/products">{item.title || item.name}</Link>
                                                        </h6>
                                                        <div className="product-rate-cover">
                                                            <div className="product-rate d-inline-block">
                                                                <div
                                                                    className="product-rating"
                                                                    style={{
                                                                        width: "90%"
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-small ml-5 text-muted"> (4.0)</span>
                                                        </div>
                                                    </td>
                                                    <td className="price" data-title="Price">
                                                        <h4 className="text-brand">Rs.{item.price}</h4>
                                                    </td>
                                                    <td className="text-center detail-info" data-title="Stock">
                                                        <div className="detail-extralink mr-15">
                                                            <div className="detail-qty border radius ">
                                                                <a onClick={(e) => decreaseQuantity(item._id)} className="qty-down">
                                                                    <i className="fi-rs-angle-small-down"></i>
                                                                </a>
                                                                <span className="qty-val">{item.quantity}</span>
                                                                <a onClick={(e) => increaseQuantity(item._id)} className="qty-up">
                                                                    <i className="fi-rs-angle-small-up"></i>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-right" data-title="Cart">
                                                        <h4 className="text-body">Rs.{item.quantity * item.price}</h4>
                                                    </td>
                                                    <td className="action" data-title="Remove">
                                                        <a onClick={(e) => deleteFromCart(item._id)} className="text-muted">
                                                            <i className="fi-rs-trash"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="6" className="text-end">
                                                    {cartItems.length > 0 && (
                                                        <a onClick={clearCart} className="text-muted">
                                                            <i className="fi-rs-cross-small"></i>
                                                            Clear Cart
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="cart-action text-end">
                                    <a className="btn ">
                                        <i className="fi-rs-shopping-bag mr-10"></i>
                                        Continue Shopping
                                    </a>
                                </div>
                                <div className="divider center_icon mt-50 mb-50">
                                    <i className="fi-rs-fingerprint"></i>
                                </div>
                                <div className="row mb-50">
                                    <div className="col-lg-6 col-md-12">
                                        <div className="heading_s1 mb-3">
                                            <h4>Calculate Shipping</h4>
                                        </div>
                                        <p className="mt-15 mb-30">
                                            Flat rate:
                                            <span className="font-xl text-brand fw-900">5%</span>
                                        </p>
                                        <form className="field_form shipping_calculator">
                                            <div className="form-row">
                                                <div className="form-group col-lg-12">
                                                    <div className="custom_select">
                                                        <select className="form-control select-active">
                                                            <option value="">Choose a option...</option>
                                                            <option value="AX">Aland Islands</option>
                                                            <option value="AF">Afghanistan</option>
                                                            <option value="AL">Albania</option>
                                                            <option value="DZ">Algeria</option>
                                                            <option value="AD">Andorra</option>
                                                            <option value="AO">Angola</option>
                                                            <option value="AI">Anguilla</option>
                                                            <option value="AQ">Antarctica</option>
                                                            <option value="AG">Antigua and Barbuda</option>
                                                            <option value="AR">Argentina</option>
                                                            <option value="AM">Armenia</option>
                                                            <option value="AW">Aruba</option>
                                                            <option value="AU">Australia</option>
                                                            <option value="AT">Austria</option>
                                                            <option value="AZ">Azerbaijan</option>
                                                            <option value="BS">Bahamas</option>
                                                            <option value="BH">Bahrain</option>
                                                            <option value="BD">Bangladesh</option>
                                                            <option value="BB">Barbados</option>
                                                            <option value="BY">Belarus</option>
                                                            <option value="PW">Belau</option>
                                                            <option value="BE">Belgium</option>
                                                            <option value="BZ">Belize</option>
                                                            <option value="BJ">Benin</option>
                                                            <option value="BM">Bermuda</option>
                                                            <option value="BT">Bhutan</option>
                                                            <option value="BO">Bolivia</option>
                                                            <option value="BQ">Bonaire, Saint Eustatius and Saba</option>
                                                            <option value="BA">Bosnia and Herzegovina</option>
                                                            <option value="BW">Botswana</option>
                                                            <option value="BV">Bouvet Island</option>
                                                            <option value="BR">Brazil</option>
                                                            <option value="IO">British Indian Ocean Territory</option>
                                                            <option value="VG">British Virgin Islands</option>
                                                            <option value="BN">Brunei</option>
                                                            <option value="BG">Bulgaria</option>
                                                            <option value="BF">Burkina Faso</option>
                                                            <option value="BI">Burundi</option>
                                                            <option value="KH">Cambodia</option>
                                                            <option value="CM">Cameroon</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="CV">Cape Verde</option>
                                                            <option value="KY">Cayman Islands</option>
                                                            <option value="CF">Central African Republic</option>
                                                            <option value="TD">Chad</option>
                                                            <option value="CL">Chile</option>
                                                            <option value="CN">China</option>
                                                            <option value="CX">Christmas Island</option>
                                                            <option value="CC">Cocos (Keeling) Islands</option>
                                                            <option value="CO">Colombia</option>
                                                            <option value="KM">Comoros</option>
                                                            <option value="CG">Congo (Brazzaville)</option>
                                                            <option value="CD">Congo (Kinshasa)</option>
                                                            <option value="CK">Cook Islands</option>
                                                            <option value="CR">Costa Rica</option>
                                                            <option value="HR">Croatia</option>
                                                            <option value="CU">Cuba</option>
                                                            <option value="CW">CuraÇao</option>
                                                            <option value="CY">Cyprus</option>
                                                            <option value="CZ">Czech Republic</option>
                                                            <option value="DK">Denmark</option>
                                                            <option value="DJ">Djibouti</option>
                                                            <option value="DM">Dominica</option>
                                                            <option value="DO">Dominican Republic</option>
                                                            <option value="EC">Ecuador</option>
                                                            <option value="EG">Egypt</option>
                                                            <option value="SV">El Salvador</option>
                                                            <option value="GQ">Equatorial Guinea</option>
                                                            <option value="ER">Eritrea</option>
                                                            <option value="EE">Estonia</option>
                                                            <option value="ET">Ethiopia</option>
                                                            <option value="FK">Falkland Islands</option>
                                                            <option value="FO">Faroe Islands</option>
                                                            <option value="FJ">Fiji</option>
                                                            <option value="FI">Finland</option>
                                                            <option value="FR">France</option>
                                                            <option value="GF">French Guiana</option>
                                                            <option value="PF">French Polynesia</option>
                                                            <option value="TF">French Southern Territories</option>
                                                            <option value="GA">Gabon</option>
                                                            <option value="GM">Gambia</option>
                                                            <option value="GE">Georgia</option>
                                                            <option value="DE">Germany</option>
                                                            <option value="GH">Ghana</option>
                                                            <option value="GI">Gibraltar</option>
                                                            <option value="GR">Greece</option>
                                                            <option value="GL">Greenland</option>
                                                            <option value="GD">Grenada</option>
                                                            <option value="GP">Guadeloupe</option>
                                                            <option value="GT">Guatemala</option>
                                                            <option value="GG">Guernsey</option>
                                                            <option value="GN">Guinea</option>
                                                            <option value="GW">Guinea-Bissau</option>
                                                            <option value="GY">Guyana</option>
                                                            <option value="HT">Haiti</option>
                                                            <option value="HM">Heard Island and McDonald Islands</option>
                                                            <option value="HN">Honduras</option>
                                                            <option value="HK">Hong Kong</option>
                                                            <option value="HU">Hungary</option>
                                                            <option value="IS">Iceland</option>
                                                            <option value="IN">India</option>
                                                            <option value="ID">Indonesia</option>
                                                            <option value="IR">Iran</option>
                                                            <option value="IQ">Iraq</option>
                                                            <option value="IM">Isle of Man</option>
                                                            <option value="IL">Israel</option>
                                                            <option value="IT">Italy</option>
                                                            <option value="CI">Ivory Coast</option>
                                                            <option value="JM">Jamaica</option>
                                                            <option value="JP">Japan</option>
                                                            <option value="JE">Jersey</option>
                                                            <option value="JO">Jordan</option>
                                                            <option value="KZ">Kazakhstan</option>
                                                            <option value="KE">Kenya</option>
                                                            <option value="KI">Kiribati</option>
                                                            <option value="KW">Kuwait</option>
                                                            <option value="KG">Kyrgyzstan</option>
                                                            <option value="LA">Laos</option>
                                                            <option value="LV">Latvia</option>
                                                            <option value="LB">Lebanon</option>
                                                            <option value="LS">Lesotho</option>
                                                            <option value="LR">Liberia</option>
                                                            <option value="LY">Libya</option>
                                                            <option value="LI">Liechtenstein</option>
                                                            <option value="LT">Lithuania</option>
                                                            <option value="LU">Luxembourg</option>
                                                            <option value="MO">Macao S.A.R., China</option>
                                                            <option value="MK">Macedonia</option>
                                                            <option value="MG">Madagascar</option>
                                                            <option value="MW">Malawi</option>
                                                            <option value="MY">Malaysia</option>
                                                            <option value="MV">Maldives</option>
                                                            <option value="ML">Mali</option>
                                                            <option value="MT">Malta</option>
                                                            <option value="MH">Marshall Islands</option>
                                                            <option value="MQ">Martinique</option>
                                                            <option value="MR">Mauritania</option>
                                                            <option value="MU">Mauritius</option>
                                                            <option value="YT">Mayotte</option>
                                                            <option value="MX">Mexico</option>
                                                            <option value="FM">Micronesia</option>
                                                            <option value="MD">Moldova</option>
                                                            <option value="MC">Monaco</option>
                                                            <option value="MN">Mongolia</option>
                                                            <option value="ME">Montenegro</option>
                                                            <option value="MS">Montserrat</option>
                                                            <option value="MA">Morocco</option>
                                                            <option value="MZ">Mozambique</option>
                                                            <option value="MM">Myanmar</option>
                                                            <option value="NA">Namibia</option>
                                                            <option value="NR">Nauru</option>
                                                            <option value="NP">Nepal</option>
                                                            <option value="NL">Netherlands</option>
                                                            <option value="AN">Netherlands Antilles</option>
                                                            <option value="NC">New Caledonia</option>
                                                            <option value="NZ">New Zealand</option>
                                                            <option value="NI">Nicaragua</option>
                                                            <option value="NE">Niger</option>
                                                            <option value="NG">Nigeria</option>
                                                            <option value="NU">Niue</option>
                                                            <option value="NF">Norfolk Island</option>
                                                            <option value="KP">North Korea</option>
                                                            <option value="NO">Norway</option>
                                                            <option value="OM">Oman</option>
                                                            <option value="PK">Pakistan</option>
                                                            <option value="PS">Palestinian Territory</option>
                                                            <option value="PA">Panama</option>
                                                            <option value="PG">Papua New Guinea</option>
                                                            <option value="PY">Paraguay</option>
                                                            <option value="PE">Peru</option>
                                                            <option value="PH">Philippines</option>
                                                            <option value="PN">Pitcairn</option>
                                                            <option value="PL">Poland</option>
                                                            <option value="PT">Portugal</option>
                                                            <option value="QA">Qatar</option>
                                                            <option value="IE">Republic of Ireland</option>
                                                            <option value="RE">Reunion</option>
                                                            <option value="RO">Romania</option>
                                                            <option value="RU">Russia</option>
                                                            <option value="RW">Rwanda</option>
                                                            <option value="ST">São Tomé and Príncipe</option>
                                                            <option value="BL">Saint Barthélemy</option>
                                                            <option value="SH">Saint Helena</option>
                                                            <option value="KN">Saint Kitts and Nevis</option>
                                                            <option value="LC">Saint Lucia</option>
                                                            <option value="SX">Saint Martin (Dutch part)</option>
                                                            <option value="MF">Saint Martin (French part)</option>
                                                            <option value="PM">Saint Pierre and Miquelon</option>
                                                            <option value="VC">Saint Vincent and the Grenadines</option>
                                                            <option value="SM">San Marino</option>
                                                            <option value="SA">Saudi Arabia</option>
                                                            <option value="SN">Senegal</option>
                                                            <option value="RS">Serbia</option>
                                                            <option value="SC">Seychelles</option>
                                                            <option value="SL">Sierra Leone</option>
                                                            <option value="SG">Singapore</option>
                                                            <option value="SK">Slovakia</option>
                                                            <option value="SI">Slovenia</option>
                                                            <option value="SB">Solomon Islands</option>
                                                            <option value="SO">Somalia</option>
                                                            <option value="ZA">South Africa</option>
                                                            <option value="GS">South Georgia/Sandwich Islands</option>
                                                            <option value="KR">South Korea</option>
                                                            <option value="SS">South Sudan</option>
                                                            <option value="ES">Spain</option>
                                                            <option value="LK">Sri Lanka</option>
                                                            <option value="SD">Sudan</option>
                                                            <option value="SR">Suriname</option>
                                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                                            <option value="SZ">Swaziland</option>
                                                            <option value="SE">Sweden</option>
                                                            <option value="CH">Switzerland</option>
                                                            <option value="SY">Syria</option>
                                                            <option value="TW">Taiwan</option>
                                                            <option value="TJ">Tajikistan</option>
                                                            <option value="TZ">Tanzania</option>
                                                            <option value="TH">Thailand</option>
                                                            <option value="TL">Timor-Leste</option>
                                                            <option value="TG">Togo</option>
                                                            <option value="TK">Tokelau</option>
                                                            <option value="TO">Tonga</option>
                                                            <option value="TT">Trinidad and Tobago</option>
                                                            <option value="TN">Tunisia</option>
                                                            <option value="TR">Turkey</option>
                                                            <option value="TM">Turkmenistan</option>
                                                            <option value="TC">Turks and Caicos Islands</option>
                                                            <option value="TV">Tuvalu</option>
                                                            <option value="UG">Uganda</option>
                                                            <option value="UA">Ukraine</option>
                                                            <option value="AE">United Arab Emirates</option>
                                                            <option value="GB">United Kingdom (UK)</option>
                                                            <option value="US">USA (US)</option>
                                                            <option value="UY">Uruguay</option>
                                                            <option value="UZ">Uzbekistan</option>
                                                            <option value="VU">Vanuatu</option>
                                                            <option value="VA">Vatican</option>
                                                            <option value="VE">Venezuela</option>
                                                            <option value="VN">Vietnam</option>
                                                            <option value="WF">Wallis and Futuna</option>
                                                            <option value="EH">Western Sahara</option>
                                                            <option value="WS">Western Samoa</option>
                                                            <option value="YE">Yemen</option>
                                                            <option value="ZM">Zambia</option>
                                                            <option value="ZW">Zimbabwe</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-row row">
                                                <div className="form-group col-lg-6">
                                                    <input required="required" placeholder="State / Country" name="name" type="text" />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input required="required" placeholder="PostCode / ZIP" name="name" type="text" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-lg-12">
                                                    <button className="btn  btn-sm">
                                                        <i className="fi-rs-shuffle mr-10"></i>
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="mb-30 mt-50">
                                            <div className="heading_s1 mb-3">
                                                <h4>Apply Coupon</h4>
                                            </div>
                                            <div className="total-amount">
                                                <div className="left">
                                                    <div className="coupon">
                                                        <form action="#" target="_blank">
                                                            <div className="form-row row justify-content-center">
                                                                <div className="form-group col-lg-6">
                                                                    <input className="font-medium" name="Coupon" placeholder="Enter Your Coupon" />
                                                                </div>
                                                                <div className="form-group col-lg-6">
                                                                    <button className="btn  btn-sm">
                                                                        <i className="fi-rs-label mr-10"></i>
                                                                        Apply
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="border p-md-4 p-30 border-radius cart-totals">
                                            <div className="heading_s1 mb-3">
                                                <h4>Cart Totals</h4>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="cart_total_label">Cart Subtotal</td>
                                                            <td className="cart_total_amount">
                                                                <span className="font-lg fw-900 text-brand">Rs. {price()}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="cart_total_label">Shipping</td>
                                                            <td className="cart_total_amount">
                                                                <i className="ti-gift mr-5"></i>
                                                                Free Shipping
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="cart_total_label">Total</td>
                                                            <td className="cart_total_amount">
                                                                <strong>
                                                                    <span className="font-xl fw-900 text-brand">Rs. {price()}</span>
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <a href="#" onClick={handleRoute} className="btn ">
                                                <i className="fi-rs-box-alt mr-10"></i>
                                                Proceed To CheckOut
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

const mapStateToProps = (state) => ({
    cartItems: state.cart,
    activeCart: state.counter
});

const mapDispatchToProps = {
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    openCart,
    clearCart
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
