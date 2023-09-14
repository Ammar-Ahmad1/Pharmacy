import { connect } from "react-redux";
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import {
  clearCart,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../redux/action/cart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn, getProviders } from "next-auth/react";

const Cart = ({
  openCart,
  cartItems,
  activeCart,
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  clearCart,
}) => {
  // console.log(cities);
  const { data: session } = useSession();
  const router = useRouter();
  // Provide a default value for name if session?.user.name is undefined
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [Delivery, setDelivery] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [gettingCity, setGettingCity] = useState(false);

  useEffect(() => {
    try {
      setGettingCity(true);
      navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setGettingCity(false);
    }
  }, []);

  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  useEffect(() => {
    if (!gettingCity) {
      setGettingCity(true);
      fetch(nominatimUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const city = data.address.city;
          setCity(city);
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
          setGettingCity(false);
        });
    }
  }, [latitude, longitude, gettingCity]);
  useEffect(() => {
    const getProvidersData = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    getProvidersData();
  }, []);
  const loginUser = async (e) => {
    e.preventDefault();
    if (!loginEmail || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password,
    });
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully");
      setShowLoginForm(false);
      console.log(result);
      if (session) {
        if (session.user.role === "customer") {
        } // Redirect to home page if logged in
        else if (session.user.role === "vendor")
          router.push("/vendor-dashboard");
        // router.push("/");
      }
    }
    setLoading(false);
  };
  console.log(cartItems, "cartItems");
  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item.price * item.quantity));

    return price;
  };
  useEffect(() => {
    if (price() > 1000) {
      setDelivery(200);
    } else {
      setDelivery(300);
    }
  }, [price()]);
  const getUser = async () => {
    const req = await fetch(`/api/users/${session.user.id}`);
    const data = await req.json();
    console.log(data.data);
    setEmail(data.data.email);
    setName(data.data.name);
    setPhone(data.data.phone);
  };
  const placeOrder = () => {
    if (session) {
      if (!name || !email || !phone || !address || !city) {
        toast.error("Please fill all the fields");
        return;
      }
      if (cartItems.length === 0) {
        toast.error("Please add items to cart");
        return;
      }
      // Create an array of order items with item ID and quantity
      const orderItems = cartItems.map((item) => ({
        medicine: item._id, // Assuming each item has an _id property
        quantity: item.quantity, // Use the quantity associated with each item
      }));

      const order = {
        items: orderItems, // An array of items in the order with their quantities
        user: session.user.id, // The user ID of the logged-in user
        date: new Date(), // Current date and time
        address: address,
        city: city,
        totalAmount: price() + delivery, // Total amount of the order
        orderNumber: "", // Will be generated in the backend
      };
      setPlacingOrder(true);
      // Send a POST request to your API route
      fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server
          if (data.success) {
            // Order was successfully created
            console.log("Order placed:", data.data);
            toast.success("Order placed successfully");
            clearCart();
            router.push("/");
            // You can perform any additional actions here, such as clearing the cart or showing a success message.
          } else {
            // Handle the case where the order creation failed
            console.error("Order creation failed:", data.error);
            // You can display an error message or take appropriate action.
          }
        })
        .catch((error) => {
          console.error("Error placing order:", error);
          // Handle any network or request-related errors here.
        })
        .finally(() => {
          setPlacingOrder(false);
        });
    } else {
      toast.error("Please login first");
    }
  };

  useEffect(() => {
    if (session) {
      getUser();
    }
  }, [session]);
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Checkout">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Checkout</h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    Carefully check the information before checkout
                  </h6>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-7">
                <div className="row mb-50">
                  <div className="col-lg-6 mb-sm-15 mb-lg-0 mb-md-3">
                    {!session && (
                      <div className="toggle_info">
                        <span>
                          <i className="fi-rs-user mr-10"></i>
                          <span className="text-muted font-lg">
                            Already have an account?
                          </span>{" "}
                          <a
                            // href="#loginform"
                            // data-bs-toggle="collapse"
                            className="collapsed font-lg"
                            aria-expanded="false"
                            onClick={() => setShowLoginForm(!showLoginForm)}
                          >
                            Click here to login
                          </a>
                        </span>
                      </div>
                    )}
                    {showLoginForm && (
                      <div
                        className={`panel-collapse collapse login_form ${
                          showLoginForm ? "show" : ""
                        }`}
                        id="loginform"
                      >
                        <div className="panel-body">
                          <p className="mb-30 font-sm">
                            If you have shopped with us before, please enter
                            your details below. If you are a new customer,
                            please proceed to the Billing &amp; Shipping
                            section.
                          </p>
                          <form method="post">
                            <div className="form-group">
                              <input
                                type="text"
                                name="email"
                                placeholder="Username Or Email"
                                onChange={(e) => {
                                  setLoginEmail(e.target.value);
                                }}
                                value={loginEmail}
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                }}
                                value={password}
                              />
                            </div>
                            <div className="login_footer form-group">
                              <div className="chek-form">
                                <div className="custome-checkbox">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="checkbox"
                                    id="remember"
                                    value=""
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="remember"
                                  >
                                    <span>Remember me</span>
                                  </label>
                                </div>
                              </div>
                              <a href="#">Forgot password?</a>
                            </div>
                            <div className="form-group">
                              <button
                                className="btn btn-md"
                                name="login"
                                onClick={loginUser}
                                disabled={loading}
                              >
                                {loading ? "Loading..." : "Login"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-6">
                    <form method="post" className="apply-coupon">
                      <input type="text" placeholder="Enter Coupon Code..." />
                      <button className="btn  btn-md" name="login">
                        Apply Coupon
                      </button>
                    </form>
                  </div>
                </div>
                <div className="mb-25">
                  <h4>Billing Details</h4>
                </div>
                <form method="post">
                  <div className="form-group">
                    <input
                      type="text"
                      required=""
                      name="fname"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      placeholder="First name *"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="billing_address"
                      required=""
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      value={address}
                      placeholder="Address *"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="billing_address2"
                      required=""
                      placeholder="Address line2"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      required=""
                      type="text"
                      name="city"
                      onChange={(e) => setCity(e.target.value)}
                      value={city}
                      placeholder="City / Town *"
                      disabled={gettingCity}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      required=""
                      type="text"
                      name="phone"
                      placeholder="Phone *"
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      value={phone}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      required=""
                      type="text"
                      name="email"
                      placeholder="Email address *"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      value={email}
                    />
                  </div>
                  <div
                    id="collapsePassword"
                    className="form-group create-account collapse in"
                  >
                    <input
                      required=""
                      type="password"
                      placeholder="Password"
                      name="password"
                    />
                  </div>

                  <div className="ship_detail">
                    <div className="form-group">
                      <div className="chek-form">
                        <div className="custome-checkbox">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="checkbox"
                            id="differentaddress"
                          />
                          <label
                            className="form-check-label label_info"
                            data-bs-toggle="collapse"
                            data-target="#collapseAddress"
                            href="#collapseAddress"
                            aria-controls="collapseAddress"
                            htmlFor="differentaddress"
                          >
                            <span>Ship to a different address?</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div
                      id="collapseAddress"
                      className="different_address collapse in"
                    >
                      <div className="form-group">
                        <input
                          type="text"
                          required=""
                          name="fname"
                          placeholder="First name *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          required=""
                          name="lname"
                          placeholder="Last name *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="cname"
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="form-group">
                        <div className="custom_select">
                          <select className="form-control select-active">
                            <option value="">Select an option...</option>
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
                            <option value="BQ">
                              Bonaire, Saint Eustatius and Saba
                            </option>
                            <option value="BA">Bosnia and Herzegovina</option>
                            <option value="BW">Botswana</option>
                            <option value="BV">Bouvet Island</option>
                            <option value="BR">Brazil</option>
                            <option value="IO">
                              British Indian Ocean Territory
                            </option>
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
                            <option value="TF">
                              French Southern Territories
                            </option>
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
                            <option value="HM">
                              Heard Island and McDonald Islands
                            </option>
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
                            <option value="SX">
                              Saint Martin (Dutch part)
                            </option>
                            <option value="MF">
                              Saint Martin (French part)
                            </option>
                            <option value="PM">
                              Saint Pierre and Miquelon
                            </option>
                            <option value="VC">
                              Saint Vincent and the Grenadines
                            </option>
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
                            <option value="GS">
                              South Georgia/Sandwich Islands
                            </option>
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
                      <div className="form-group">
                        <input
                          type="text"
                          name="billing_address"
                          required=""
                          placeholder="Address *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="billing_address2"
                          required=""
                          placeholder="Address line2"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="city"
                          placeholder="City / Town *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="state"
                          placeholder="State / County *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="zipcode"
                          placeholder="Postcode / ZIP *"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-30">
                    <textarea rows="5" placeholder="Order notes"></textarea>
                  </div>
                </form>
              </div>
              <div className="col-lg-5">
                <div className="border p-40 cart-totals ml-30 mb-50">
                  <div className="d-flex align-items-end justify-content-between mb-30">
                    <h4>Your Order</h4>
                    <h6 className="text-muted">Subtotal</h6>
                  </div>
                  <div className="divider-2 mb-30"></div>
                  <div className="table-responsive order_table">
                    {cartItems.length <= 0 && "No Products"}
                    <table
                      className={
                        cartItems.length > 0 ? "table no-border" : "d-none"
                      }
                    >
                      <tbody>
                        {cartItems.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <img
                                src={
                                  item.images ? item.images[0]?.img : item.image
                                }
                                alt="#"
                              />
                            </td>
                            <td>
                              <h6 className="w-160 mb-5">
                                <a>{item.title}</a>
                                <div className="product-rate-cover">
                                  <div className="product-rate d-inline-block">
                                    <div
                                      className="product-rating"
                                      style={{
                                        width: "90%",
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-small ml-5 text-muted">
                                    {" "}
                                    (4.0)
                                  </span>
                                </div>
                              </h6>{" "}
                            </td>
                            <td>
                              <h6 className="text-muted pl-20 pr-20">
                                x {item.quantity}
                              </h6>
                            </td>
                            <td>
                              <h4 className="text-brand">
                                Rs.
                                {item.quantity * item.price}
                              </h4>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                  <div className="payment_method">
                    <div className="mb-25">
                      <h5>Payment</h5>
                    </div>
                    <div className="payment_option">
                      <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required=""
                          type="radio"
                          name="payment_option"
                          id="exampleRadios3"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios3"
                          data-bs-toggle="collapse"
                          data-target="#bankTranfer"
                          aria-controls="bankTranfer"
                        >
                          Cash On Delivery
                        </label>
                        <div
                          className="form-group collapse in"
                          id="bankTranfer"
                        >
                          <p className="text-muted mt-5">
                            There are many variations of passages of Lorem Ipsum
                            available, but the majority have suffered
                            alteration.{" "}
                          </p>
                        </div>
                      </div>
                      {/* <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required=""
                          type="radio"
                          name="payment_option"
                          id="exampleRadios4"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios4"
                          data-bs-toggle="collapse"
                          data-target="#checkPayment"
                          aria-controls="checkPayment"
                        >
                          Check Payment
                        </label>
                        <div
                          className="form-group collapse in"
                          id="checkPayment"
                        >
                          <p className="text-muted mt-5">
                            Please send your cheque to Store Name, Store Street,
                            Store Town, Store State / County, Store Postcode.{" "}
                          </p>
                        </div>
                      </div> */}
                      {/* <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required=""
                          type="radio"
                          name="payment_option"
                          id="exampleRadios5"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios5"
                          data-bs-toggle="collapse"
                          data-target="#paypal"
                          aria-controls="paypal"
                        >
                          Paypal
                        </label>
                        <div className="form-group collapse in" id="paypal">
                          <p className="text-muted mt-5">
                            Pay via PayPal; you can pay with your credit card if
                            you don't have a PayPal account.
                          </p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <a
                    href="#"
                    className="btn btn-fill-out btn-block mt-30"
                    onClick={placeOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? "Placing Order..." : "Place Order"}
                  </a>
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
  activeCart: state.counter,
});

const mapDispatchToProps = {
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  openCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
