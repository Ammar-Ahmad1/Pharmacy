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
  const [delivery, setDelivery] = useState(0);
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
  // useEffect(() => {
  //   if (!gettingCity) {
  //     setGettingCity(true);
  //     fetch(nominatimUrl)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         const city = data.address.city;
  //         setCity(city);
  //       })
  //       .catch((error) => console.error("Error:", error))
  //       .finally(() => {
  //         setGettingCity(false);
  //       });
  //   }
  // }, [latitude, longitude, gettingCity]);
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
      const deliveryCost = price() >= 1000 ? 200 : 300;
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
        totalAmount: price() + deliveryCost, // Total amount of the order
        orderNumber: "", // Will be generated in the backend
        profit: 0, // Will be calculated in the backend
      };
      console.log(order);
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
                        className={`panel-collapse collapse login_form ${showLoginForm ? "show" : ""
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
                    <label>Full Name (example: Rolls Royce) *</label>
                    <input
                      type="text"
                      required=""
                      name="fname"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      placeholder="Your Name *"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address 1 *</label>
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
                    <label>Address 2</label>
                    <input
                      type="text"
                      name="billing_address2"
                      required=""
                      placeholder="Address line 2"
                    />
                  </div>
                  <div className="form-group">

                    <label>City*</label>

                    <select
                    // className="form-control"
                    style={{
                      color: "black",
                      fontSize: "16px",
                      height: "50px",
                      width: "100%",
                      border: "1px solid #e5e5e5",
                      borderRadius: "5px",
                      padding: "0 15px",
                      marginBottom: "10px",
                      marginTop: "10px",
                    }}
                    name="city"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}

                    required>
                      <option value="" disabled selected>
                        Select The City
                      </option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="" disabled
                      style={{ color: "black", fontWeight: "bold" }}
                      >
                        Punjab Cities
                      </option>
                      <option value="Ahmed Nager Chatha">
                        Ahmed Nager Chatha
                      </option>
                      <option value="Ahmadpur East">Ahmadpur East</option>
                      <option value="Ali Khan Abad">Ali Khan Abad</option>
                      <option value="Alipur">Alipur</option>
                      <option value="Arifwala">Arifwala</option>
                      <option value="Attock">Attock</option>
                      <option value="Bhera">Bhera</option>
                      <option value="Bhalwal">Bhalwal</option>
                      <option value="Bahawalnagar">Bahawalnagar</option>
                      <option value="Bahawalpur">Bahawalpur</option>
                      <option value="Bhakkar">Bhakkar</option>
                      <option value="Burewala">Burewala</option>
                      <option value="Chillianwala">Chillianwala</option>
                      <option value="Chakwal">Chakwal</option>
                      <option value="Chichawatni">Chichawatni</option>
                      <option value="Chiniot">Chiniot</option>
                      <option value="Chishtian">Chishtian</option>
                      <option value="Daska">Daska</option>
                      <option value="Darya Khan">Darya Khan</option>
                      <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                      <option value="Dhaular">Dhaular</option>
                      <option value="Dina">Dina</option>
                      <option value="Dinga">Dinga</option>
                      <option value="Dipalpur">Dipalpur</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Ferozewala">Ferozewala</option>
                      <option value="Fateh Jhang">Fateh Jang</option>
                      <option value="Ghakhar Mandi">Ghakhar Mandi</option>
                      <option value="Gojra">Gojra</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Gujrat">Gujrat</option>
                      <option value="Gujar Khan">Gujar Khan</option>
                      <option value="Hafizabad">Hafizabad</option>
                      <option value="Haroonabad">Haroonabad</option>
                      <option value="Hasilpur">Hasilpur</option>
                      <option value="Haveli Lakha">Haveli Lakha</option>
                      <option value="Jatoi">Jatoi</option>
                      <option value="Jalalpur">Jalalpur</option>
                      <option value="Jattan">Jattan</option>
                      <option value="Jampur">Jampur</option>
                      <option value="Jaranwala">Jaranwala</option>
                      <option value="Jhang">Jhang</option>
                      <option value="Jhelum">Jhelum</option>
                      <option value="Kalabagh">Kalabagh</option>
                      <option value="Karor Lal Esan">Karor Lal Esan</option>
                      <option value="Kasur">Kasur</option>
                      <option value="Kamalia">Kamalia</option>
                      <option value="Kamoke">Kamoke</option>
                      <option value="Khanewal">Khanewal</option>
                      <option value="Khanpur">Khanpur</option>
                      <option value="Kharian">Kharian</option>
                      <option value="Khushab">Khushab</option>
                      <option value="Kot Addu">Kot Addu</option>
                      <option value="Jauharabad">Jauharabad</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Lalamusa">Lalamusa</option>
                      <option value="Layyah">Layyah</option>
                      <option value="Liaquat Pur">Liaquat Pur</option>
                      <option value="Lodhran">Lodhran</option>
                      <option value="Malakwal">Malakwal</option>
                      <option value="Mamoori">Mamoori</option>
                      <option value="Mailsi">Mailsi</option>
                      <option value="Mandi Bahauddin">Mandi Bahauddin</option>
                      <option value="Mian Channu">Mian Channu</option>
                      <option value="Mianwali">Mianwali</option>
                      <option value="Multan">Multan</option>
                      <option value="Murree">Murree</option>
                      <option value="Muridke">Muridke</option>
                      <option value="Mianwali Bangla">Mianwali Bangla</option>
                      <option value="Muzaffargarh">Muzaffargarh</option>
                      <option value="Narowal">Narowal</option>
                      <option value="Nankana Sahib">Nankana Sahib</option>
                      <option value="Okara">Okara</option>
                      <option value="Renala Khurd">Renala Khurd</option>
                      <option value="Pakpattan">Pakpattan</option>
                      <option value="Pattoki">Pattoki</option>
                      <option value="Pir Mahal">Pir Mahal</option>
                      <option value="Qaimpur">Qaimpur</option>
                      <option value="Qila Didar Singh">Qila Didar Singh</option>
                      <option value="Rabwah">Rabwah</option>
                      <option value="Raiwind">Raiwind</option>
                      <option value="Rajanpur">Rajanpur</option>
                      <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Sadiqabad">Sadiqabad</option>
                      <option value="Safdarabad">Safdarabad</option>
                      <option value="Sahiwal">Sahiwal</option>
                      <option value="Sangla Hill">Sangla Hill</option>
                      <option value="Sarai Alamgir">Sarai Alamgir</option>
                      <option value="Sargodha">Sargodha</option>
                      <option value="Shakargarh">Shakargarh</option>
                      <option value="Sheikhupura">Sheikhupura</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Sohawa">Sohawa</option>
                      <option value="Soianwala">Soianwala</option>
                      <option value="Siranwali">Siranwali</option>
                      <option value="Talagang">Talagang</option>
                      <option value="Taxila">Taxila</option>
                      <option value="Toba Tek Singh">Toba Tek Singh</option>
                      <option value="Vehari">Vehari</option>
                      <option value="Wah Cantonment">Wah Cantonment</option>
                      <option value="Wazirabad">Wazirabad</option>
                      <option value="" disabled
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        Sindh Cities
                      </option>
                      <option value="Badin">Badin</option>
                      <option value="Bhirkan">Bhirkan</option>
                      <option value="Rajo Khanani">Rajo Khanani</option>
                      <option value="Chak">Chak</option>
                      <option value="Dadu">Dadu</option>
                      <option value="Digri">Digri</option>
                      <option value="Diplo">Diplo</option>
                      <option value="Dokri">Dokri</option>
                      <option value="Ghotki">Ghotki</option>
                      <option value="Haala">Haala</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Islamkot">Islamkot</option>
                      <option value="Jacobabad">Jacobabad</option>
                      <option value="Jamshoro">Jamshoro</option>
                      <option value="Jungshahi">Jungshahi</option>
                      <option value="Kandhkot">Kandhkot</option>
                      <option value="Kandiaro">Kandiaro</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Kashmore">Kashmore</option>
                      <option value="Keti Bandar">Keti Bandar</option>
                      <option value="Khairpur">Khairpur</option>
                      <option value="Kotri">Kotri</option>
                      <option value="Larkana">Larkana</option>
                      <option value="Matiari">Matiari</option>
                      <option value="Mehar">Mehar</option>
                      <option value="Mirpur Khas">Mirpur Khas</option>
                      <option value="Mithani">Mithani</option>
                      <option value="Mithi">Mithi</option>
                      <option value="Mehrabpur">Mehrabpur</option>
                      <option value="Moro">Moro</option>
                      <option value="Nagarparkar">Nagarparkar</option>
                      <option value="Naudero">Naudero</option>
                      <option value="Naushahro Feroze">Naushahro Feroze</option>
                      <option value="Naushara">Naushara</option>
                      <option value="Nawabshah">Nawabshah</option>
                      <option value="Nazimabad">Nazimabad</option>
                      <option value="Qambar">Qambar</option>
                      <option value="Qasimabad">Qasimabad</option>
                      <option value="Ranipur">Ranipur</option>
                      <option value="Ratodero">Ratodero</option>
                      <option value="Rohri">Rohri</option>
                      <option value="Sakrand">Sakrand</option>
                      <option value="Sanghar">Sanghar</option>
                      <option value="Shahbandar">Shahbandar</option>
                      <option value="Shahdadkot">Shahdadkot</option>
                      <option value="Shahdadpur">Shahdadpur</option>
                      <option value="Shahpur Chakar">Shahpur Chakar</option>
                      <option value="Shikarpaur">Shikarpaur</option>
                      <option value="Sukkur">Sukkur</option>
                      <option value="Tangwani">Tangwani</option>
                      <option value="Tando Adam Khan">Tando Adam Khan</option>
                      <option value="Tando Allahyar">Tando Allahyar</option>
                      <option value="Tando Muhammad Khan">
                        Tando Muhammad Khan
                      </option>
                      <option value="Thatta">Thatta</option>
                      <option value="Umerkot">Umerkot</option>
                      <option value="Warah">Warah</option>
                      <option value="" disabled
                      style={{ color: "black", fontWeight: "bold" }}
                      >
                        Khyber Cities
                      </option>
                      <option value="Abbottabad">Abbottabad</option>
                      <option value="Adezai">Adezai</option>
                      <option value="Alpuri">Alpuri</option>
                      <option value="Akora Khattak">Akora Khattak</option>
                      <option value="Ayubia">Ayubia</option>
                      <option value="Banda Daud Shah">Banda Daud Shah</option>
                      <option value="Bannu">Bannu</option>
                      <option value="Batkhela">Batkhela</option>
                      <option value="Battagram">Battagram</option>
                      <option value="Birote">Birote</option>
                      <option value="Chakdara">Chakdara</option>
                      <option value="Charsadda">Charsadda</option>
                      <option value="Chitral">Chitral</option>
                      <option value="Daggar">Daggar</option>
                      <option value="Dargai">Dargai</option>
                      <option value="Darya Khan">Darya Khan</option>
                      <option value="Dera Ismail Khan">Dera Ismail Khan</option>
                      <option value="Doaba">Doaba</option>
                      <option value="Dir">Dir</option>
                      <option value="Drosh">Drosh</option>
                      <option value="Hangu">Hangu</option>
                      <option value="Haripur">Haripur</option>
                      <option value="Karak">Karak</option>
                      <option value="Kohat">Kohat</option>
                      <option value="Kulachi">Kulachi</option>
                      <option value="Lakki Marwat">Lakki Marwat</option>
                      <option value="Latamber">Latamber</option>
                      <option value="Madyan">Madyan</option>
                      <option value="Mansehra">Mansehra</option>
                      <option value="Mardan">Mardan</option>
                      <option value="Mastuj">Mastuj</option>
                      <option value="Mingora">Mingora</option>
                      <option value="Nowshera">Nowshera</option>
                      <option value="Paharpur">Paharpur</option>
                      <option value="Pabbi">Pabbi</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Saidu Sharif">Saidu Sharif</option>
                      <option value="Shorkot">Shorkot</option>
                      <option value="Shewa Adda">Shewa Adda</option>
                      <option value="Swabi">Swabi</option>
                      <option value="Swat">Swat</option>
                      <option value="Tangi">Tangi</option>
                      <option value="Tank">Tank</option>
                      <option value="Thall">Thall</option>
                      <option value="Timergara">Timergara</option>
                      <option value="Tordher">Tordher</option>
                      <option value="" disabled
                      style={{ color: "black", fontWeight: "bold" }}
                      >
                        Balochistan Cities
                      </option>
                      <option value="Awaran">Awaran</option>
                      <option value="Barkhan">Barkhan</option>
                      <option value="Chagai">Chagai</option>
                      <option value="Dera Bugti">Dera Bugti</option>
                      <option value="Gwadar">Gwadar</option>
                      <option value="Harnai">Harnai</option>
                      <option value="Jafarabad">Jafarabad</option>
                      <option value="Jhal Magsi">Jhal Magsi</option>
                      <option value="Kacchi">Kacchi</option>
                      <option value="Kalat">Kalat</option>
                      <option value="Kech">Kech</option>
                      <option value="Kharan">Kharan</option>
                      <option value="Khuzdar">Khuzdar</option>
                      <option value="Killa Abdullah">Killa Abdullah</option>
                      <option value="Killa Saifullah">Killa Saifullah</option>
                      <option value="Kohlu">Kohlu</option>
                      <option value="Lasbela">Lasbela</option>
                      <option value="Lehri">Lehri</option>
                      <option value="Loralai">Loralai</option>
                      <option value="Mastung">Mastung</option>
                      <option value="Musakhel">Musakhel</option>
                      <option value="Nasirabad">Nasirabad</option>
                      <option value="Nushki">Nushki</option>
                      <option value="Panjgur">Panjgur</option>
                      <option value="Pishin Valley">Pishin Valley</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sherani">Sherani</option>
                      <option value="Sibi">Sibi</option>
                      <option value="Sohbatpur">Sohbatpur</option>
                      <option value="Washuk">Washuk</option>
                      <option value="Zhob">Zhob</option>
                      <option value="Ziarat">Ziarat</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phone Number*</label>
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
                    <label>Email*</label>
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
                        <label>Full Name (example: Rolls Royce) *</label>
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
                    <label>Other Notes</label>
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
