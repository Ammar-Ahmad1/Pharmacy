import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CategoryProduct2 from "../ecommerce/Filter/CategoryProduct2";
import CategoryProduct3 from "../ecommerce/Filter/CategoryProduct3";
import Search from "../ecommerce/Search";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const Header = ({
  totalCartItems,
  totalCompareItems,
  toggleClick,
  totalWishlistItems,
}) => {
  const [isToggled, setToggled] = useState(false);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY >= 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });
  const { data: session } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleToggle = () => setToggled(!isToggled);

  return (
    <>
      <header className="header-area header-style-1 header-height-2">
        <div className="mobile-promotion">
          <span>
            Grand opening, <strong>up to 15%</strong> off all items. Only{" "}
            <strong>3 days</strong> left
          </span>
        </div>

        <div className="header-top header-top-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-xl-3 col-lg-4">
                <div className="header-info">
                  <ul>
                    <li>
                      <Link href="/page-about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/page-account">My Account</Link>
                    </li>
                    <li>
                      <Link href="/shop-wishlist">Wishlist</Link>
                    </li>
                    {/* <li>
                       <Link href="/page-account">Order Tracking</Link> 
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4">
                <div className="header-info header-info-right">
                  <ul>
                    <li>
                      Need help? Call Us:{" "}
                      <strong className="text-brand"> + 1800 900</strong>
                    </li>
                    {/* <li>
                      <Link href="/#" className="language-dropdown-active">
                        <i className="fi-rs-world"></i>
                        English
                        <i className="fi-rs-angle-small-down"></i>
                      </Link>
                      <ul className="language-dropdown">
                        <li>
                          <Link href="/#">
                            <img
                              src="/assets/imgs/theme/flag-fr.png"
                              alt="nest"
                            />
                            Français
                          </Link>
                        </li>
                        <li>
                          <Link href="/#">
                            <img
                              src="/assets/imgs/theme/flag-dt.png"
                              alt="nest"
                            />
                            Deutsch
                          </Link>
                        </li>
                        <li>
                          <Link href="/#">
                            <img
                              src="/assets/imgs/theme/flag-ru.png"
                              alt="nest"
                            />
                            Pусский
                          </Link>
                        </li>
                      </ul>
                    </li> */}
                    {/* <li>
                      <a className="language-dropdown-active" href="#">
                        USD <i className="fi-rs-angle-small-down"></i>
                      </a>
                      <ul className="language-dropdown">
                        <li>
                          <a href="#">
                            <img
                              src="/assets/imgs/theme/flag-fr.png"
                              alt="nest"
                            />
                            INR
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img
                              src="/assets/imgs/theme/flag-dt.png"
                              alt="nest"
                            />
                            MBP
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img
                              src="/assets/imgs/theme/flag-ru.png"
                              alt="nest"
                            />
                            EU
                          </a>
                        </li>
                      </ul>
                    </li> */}
                    {!session?.user?.id && (
                      <li>
                        <Link href="/page-register" className="text-brand">
                          Sign Up
                        </Link>
                      </li>
                    )}
                    {!session?.user?.id && (
                      <li>
                        <Link href="/page-login" className="text-brand">
                          Log In
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="header-wrap">
              <div className="logo logo-width-2">
                <Link href="/">
                  <img src="/assets/imgs/oxygenGreen.svg" alt="logo" />
                </Link>
              </div>
              <div className="header-right mx-4">
                <div className="search-style-2">
                  <Search />
                </div>
                <div className="header-action-right">
                  <div className="header-action-2">
                    <div className="search-location">
                      <form action="#">
                        <select className="select-active">
                          <option value="" disabled selected>
                            Select The City
                          </option>
                          <option value="Islamabad">Islamabad</option>
                          <option
                            value=""
                            disabled
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
                          <option value="Dera Ghazi Khan">
                            Dera Ghazi Khan
                          </option>
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
                          <option value="Mandi Bahauddin">
                            Mandi Bahauddin
                          </option>
                          <option value="Mian Channu">Mian Channu</option>
                          <option value="Mianwali">Mianwali</option>
                          <option value="Multan">Multan</option>
                          <option value="Murree">Murree</option>
                          <option value="Muridke">Muridke</option>
                          <option value="Mianwali Bangla">
                            Mianwali Bangla
                          </option>
                          <option value="Muzaffargarh">Muzaffargarh</option>
                          <option value="Narowal">Narowal</option>
                          <option value="Nankana Sahib">Nankana Sahib</option>
                          <option value="Okara">Okara</option>
                          <option value="Renala Khurd">Renala Khurd</option>
                          <option value="Pakpattan">Pakpattan</option>
                          <option value="Pattoki">Pattoki</option>
                          <option value="Pir Mahal">Pir Mahal</option>
                          <option value="Qaimpur">Qaimpur</option>
                          <option value="Qila Didar Singh">
                            Qila Didar Singh
                          </option>
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
                          <option
                            value=""
                            disabled
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
                          <option value="Naushahro Feroze">
                            Naushahro Feroze
                          </option>
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
                          <option value="Tando Adam Khan">
                            Tando Adam Khan
                          </option>
                          <option value="Tando Allahyar">Tando Allahyar</option>
                          <option value="Tando Muhammad Khan">
                            Tando Muhammad Khan
                          </option>
                          <option value="Thatta">Thatta</option>
                          <option value="Umerkot">Umerkot</option>
                          <option value="Warah">Warah</option>
                          <option
                            value=""
                            disabled
                            style={{ color: "black", fontWeight: "bold" }}
                          >
                            Khyber Cities
                          </option>
                          <option value="Abbottabad">Abbottabad</option>
                          <option value="Adezai">Adezai</option>
                          <option value="Alpuri">Alpuri</option>
                          <option value="Akora Khattak">Akora Khattak</option>
                          <option value="Ayubia">Ayubia</option>
                          <option value="Banda Daud Shah">
                            Banda Daud Shah
                          </option>
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
                          <option value="Dera Ismail Khan">
                            Dera Ismail Khan
                          </option>
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
                          <option
                            value=""
                            disabled
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
                          <option value="Killa Saifullah">
                            Killa Saifullah
                          </option>
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
                      </form>
                    </div>

                    <div
                      className="header-action-icon-2"
                      style={{
                        display:
                          session?.user?.role === "vendor" ? "none" : "block",
                      }}
                    >
                      <Link href="/shop-compare">
                        <img
                          className="svgInject"
                          alt="Evara"
                          src="/assets/imgs/theme/icons/icon-compare.svg"
                        />
                        <span className="pro-count blue">
                          {totalCompareItems}
                        </span>
                      </Link>
                      <Link href="/shop-compare">
                        <span className="lable ml-0">Compare</span>
                      </Link>
                    </div>
                    <div
                      className="header-action-icon-2"
                      style={{
                        display:
                          session?.user?.role === "vendor" ? "none" : "block",
                      }}
                    >
                      <Link href="/shop-wishlist">
                        <img
                          className="svgInject"
                          alt="Evara"
                          src="/assets/imgs/theme/icons/icon-heart.svg"
                        />
                        <span className="pro-count blue">
                          {totalWishlistItems}
                        </span>
                      </Link>
                      <Link href="/shop-wishlist">
                        <span className="lable">Wishlist</span>
                      </Link>
                    </div>
                    <div
                      className="header-action-icon-2"
                      style={{
                        display:
                          session?.user?.role === "vendor" ? "none" : "block",
                      }}
                    >
                      <Link href="/shop-cart" className="mini-cart-icon">
                        <img
                          alt="Evara"
                          src="/assets/imgs/theme/icons/icon-cart.svg"
                        />
                        <span className="pro-count blue">{totalCartItems}</span>
                      </Link>
                      <Link href="/shop-cart">
                        <span className="lable">Cart</span>
                      </Link>
                    </div>

                    {session?.user?.id && (
                      <div className="header-action-icon-2">
                        <Link href="/page-account">
                          <img
                            className="svgInject"
                            alt="Nest"
                            src="/assets/imgs/theme/icons/icon-user.svg"
                          />
                        </Link>
                        <Link href="/page-account">
                          <span className="lable ml-0">Account</span>
                        </Link>
                        <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                          <ul>
                            <li>
                              <Link href="/page-account">
                                <i className="fi fi-rs-user mr-10"></i>
                                My Account
                              </Link>
                            </li>
                            <li
                              style={{
                                display:
                                  session?.user?.role === "vendor"
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Link href="/page-account">
                                <i className="fi fi-rs-location-alt mr-10"></i>
                                Order Tracking
                              </Link>
                            </li>
                            <li
                              style={{
                                display:
                                  session?.user?.role === "vendor"
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Link href="/page-account">
                                <i className="fi fi-rs-label mr-10"></i>
                                My Voucher
                              </Link>
                            </li>
                            <li
                              style={{
                                display:
                                  session?.user?.role === "vendor"
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Link href="/shop-wishlist">
                                <i className="fi fi-rs-heart mr-10"></i>
                                My Wishlist
                              </Link>
                            </li>
                            <li>
                              <Link href="/page-account">
                                <i className="fi fi-rs-settings-sliders mr-10"></i>
                                Setting
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <i
                                  className="fi fi-rs-sign-out mr-10"
                                  onClick={handleLogout}
                                ></i>
                                <span onClick={handleLogout}>Sign out</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            scroll
              ? "header-bottom header-bottom-bg-color sticky-bar stick"
              : "header-bottom header-bottom-bg-color sticky-bar"
          }
        >
          <div className="container">
            <div className="header-wrap header-space-between position-relative">
              <div className="logo logo-width-1 d-block d-lg-none">
                <Link href="/">
                  <img src="/assets/imgs/oxygenGreen.svg" alt="logo" />
                </Link>
              </div>
              <div className="header-nav d-none d-lg-flex">
                <div className="main-categori-wrap d-none d-lg-block">
                  <a
                    className="categories-button-active"
                    onClick={handleToggle}
                  >
                    <span className="fi-rs-apps"></span>
                    All Categories
                    <i className="fi-rs-angle-down"></i>
                  </a>

                  <div
                    className={
                      isToggled
                        ? "categories-dropdown-wrap categories-dropdown-active-large font-heading open"
                        : "categories-dropdown-wrap categories-dropdown-active-large font-heading"
                    }
                  >
                    <div className="d-flex categori-dropdown-inner">
                      <CategoryProduct2 />
                      <CategoryProduct3 />
                    </div>
                    <div
                      className="more_slide_open"
                      style={{ display: "none" }}
                    >
                      <div className="d-flex categori-dropdown-inner">
                        <ul>
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-1.svg"
                                alt="nest"
                              />
                              Milks and Dairies
                            </Link>
                          </li>
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-2.svg"
                                alt="nest"
                              />
                              Clothing & beauty
                            </Link>
                          </li>
                        </ul>
                        <ul className="end">
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-3.svg"
                                alt="nest"
                              />
                              Wines & Drinks
                            </Link>
                          </li>
                          <li>
                            <Link href="/products">
                              <img
                                src="/assets/imgs/theme/icons/icon-4.svg"
                                alt="nest"
                              />
                              Fresh Seafood
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block  font-heading">
                  <nav>
                    <ul>
                      <li className="hot-deals">
                        <img
                          src="/assets/imgs/theme/icons/icon-hot.svg"
                          alt="hot deals"
                        />
                        <Link href="/products">Hot Deals</Link>
                      </li>
                      <li>
                        <Link href="/">Home</Link>
                      </li>

                      <li>
                        <Link href="/products">
                          Shop
                          {/* <i className="fi-rs-angle-down"></i> */}
                        </Link>
                      </li>

                      <li>
                        <a href="#">
                          Vendors <i className="fi-rs-angle-down"></i>
                        </a>
                        <ul className="sub-menu">
                          <li>
                            <Link href="/vendors">Vendors Grid</Link>
                          </li>
                          <li>
                            <Link href="/vendors-list">Vendors List</Link>
                          </li>
                          <li>
                            <Link href="/vendor-dashboard">
                              Vendor Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link href="/vendor-guide">Vendor Guide</Link>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <Link href="/#">
                          Pages
                          <i className="fi-rs-angle-down"></i>
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link href="/page-about">About Us</Link>
                          </li>
                          <li>
                            <Link href="/add-item">Add Item</Link>
                          </li>
                          <li>
                            <Link href="/page-contact">Contact</Link>
                          </li>
                          <li>
                            <Link href="/page-account">My Account</Link>
                          </li>
                          <li>
                            <Link href="/page-login">Login</Link>
                          </li>
                          <li>
                            <Link href="/page-register">Register</Link>
                          </li>
                          <li>
                            <Link href="/page-purchase-guide">
                              Purchase Guide
                            </Link>
                          </li>
                          <li>
                            <Link href="/page-privacy-policy">
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link href="/page-terms">Terms of Service</Link>
                          </li>
                          <li>
                            <Link href="/page-404">404 Page</Link>
                          </li>
                          <li>
                            <Link href="/forget-password">Forget Password</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/page-about">About</Link>
                      </li>
                      <li>
                        <Link href="/page-contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="hotline d-none d-lg-flex">
                <img
                  src="/assets/imgs/theme/icons/icon-headphone.svg"
                  alt="hotline"
                />

                <p>
                  1900 - 888<span>24/7 Support Center</span>
                </p>
              </div>

              <div className="header-action-icon-2 d-block d-lg-none">
                <div
                  className="burger-icon burger-icon-white"
                  onClick={toggleClick}
                >
                  <span className="burger-icon-top"></span>
                  <span className="burger-icon-mid"></span>
                  <span className="burger-icon-bottom"></span>
                </div>
              </div>

              <div className="header-action-right d-block d-lg-none">
                <div className="header-action-2">
                  <div className="header-action-icon-2">
                    <Link href="/shop-wishlist">
                      <img
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-heart.svg"
                      />
                      <span className="pro-count white">
                        {totalWishlistItems}
                      </span>
                    </Link>
                  </div>
                  <div className="header-action-icon-2">
                    <Link href="/shop-cart" className="mini-cart-icon">
                      <img
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-cart.svg"
                      />
                      <span className="pro-count white">{totalCartItems}</span>
                    </Link>
                    <div className="cart-dropdown-wrap cart-dropdown-hm2">
                      <ul>
                        <li>
                          <div className="shopping-cart-img">
                            <Link href="/shop-grid-right">
                              <img
                                alt="Evara"
                                src="/assets/imgs/shop/thumbnail-3.jpg"
                              />
                            </Link>
                          </div>
                          <div className="shopping-cart-title">
                            <h4>
                              <Link href="/shop-grid-right">
                                Plain Striola Shirts
                              </Link>
                            </h4>
                            <h3>
                              <span>1 × </span>
                              Rs.800.00
                            </h3>
                          </div>
                          <div className="shopping-cart-delete">
                            <Link href="/#">
                              <i className="fi-rs-cross-small"></i>
                            </Link>
                          </div>
                        </li>
                        <li>
                          <div className="shopping-cart-img">
                            <Link href="/shop-grid-right">
                              <img
                                alt="Evara"
                                src="/assets/imgs/shop/thumbnail-4.jpg"
                              />
                            </Link>
                          </div>
                          <div className="shopping-cart-title">
                            <h4>
                              <Link href="/shop-grid-right">
                                Macbook Pro 2024
                              </Link>
                            </h4>
                            <h3>
                              <span>1 × </span>
                              Rs.3500.00
                            </h3>
                          </div>
                          <div className="shopping-cart-delete">
                            <Link href="/#">
                              <i className="fi-rs-cross-small"></i>
                            </Link>
                          </div>
                        </li>
                      </ul>
                      <div className="shopping-cart-footer">
                        <div className="shopping-cart-total">
                          <h4>
                            Total
                            <span>Rs.383.00</span>
                          </h4>
                        </div>
                        <div className="shopping-cart-button">
                          <Link href="/shop-cart">View cart</Link>
                          <Link href="/shop-checkout">Checkout</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

const mapStateToProps = (state) => ({
  totalCartItems: state.cart.length,
  totalCompareItems: state.compare.items.length,
  totalWishlistItems: state.wishlist.items.length,
});

export default connect(mapStateToProps, null)(Header);
