"use client";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import React, { useState, useEffect } from "react";
import { signIn, getProviders,useSession } from "next-auth/react";
import { toast } from "react-toastify";
import OtpInput from "react18-input-otp";
import AuthCode from "react-auth-code-input";
import { useRouter } from "next/navigation";

function Privacy() {
  // const auth = getAuth();
  const router = useRouter();
  const [providers, setProviders] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [codeOTP, setCodeOTP] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [verificationId, setVerificationId] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      toast.success("You are already registered");
      router.push("/"); // Redirect to home page if logged in
    }
  }, [session]);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);
  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic using the signIn function
    const user = signIn(provider);
    console.log(user, "user in login modal");
    // console.log(user)
    if (user) {
      router.push("/register", {
        email: user.email,
        name: user.name,
        image: user.image,
      });
    }
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !role) {
      toast.error("Please fill all the fields");
      return;
    }

    if (password === confirmPassword) {
      console.log(name, email, password, role, phone);
      fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          router.push("/page-login");
          if (data.error) {
            console.log(data.error);
          } else {
            console.log(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Password and Confirm Password does not match");
      return;
    }
  };

  const [recievedOTP, setRecievedOTP] = useState(false);
  const [sendOTP, setSendOTP] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // this is coming from react-otp-input package
  const [otp, setOtp] = useState("");

  const handleNextForm = async (e) => {
    e.preventDefault();
    if (!codeOTP) {
      toast.error("Please Enter OTP");
      return;
    } else if (codeOTP.trim() === "" || codeOTP.length !== 6) {
      toast.error("Please Enter Complete OTP");
      return;
    }

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          code: codeOTP,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Verification successful!");
        setRecievedOTP(true);
        // Handle successful verification, e.g., redirect to another page
      } else {
        toast.error("Verification failed. Please check the code.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification.");
    }
  };
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please Enter Mobile Number");
      return;
    }
    handleSendCode();
  };


  const handleSendCode = async () => {
    if (!isValid) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("OTP sent successfully");
        setSendOTP(true);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP");
    }
  };


  const handlePhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    const regex = /^[0-9\b]+$/;

    if (phoneNumber === "" || regex.test(phoneNumber)) {
      const phoneNumberPattern = /^(?:\+92|0)[0-9]{10}$/;
      const isValidNumber = phoneNumberPattern.test(phoneNumber);
      setPhone(phoneNumber);
      setIsValid(isValidNumber);
    }
  };

  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Privacy">
        <div className="page-content pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1 mb-50">
                          <h1 className="mb-5">Create an Account</h1>
                          <p>
                            Already have an account?{" "}
                            <Link href="/page-login">Log in instead!</Link>
                          </p>
                        </div>

                        {/* Before OTP */}
                        {!recievedOTP && (
                          <form method="post">
                            <div className="form-group">
                              <input
                                type="text"
                                required
                                aria-required
                                placeholder="Phone Number"
                                value={phone}
                                name="phone-number"
                                onChange={handlePhoneNumberChange}
                                className={isValid ? "valid" : "invalid"}
                              />

                              {!isValid && phone.trim() !== "" && (
                                <p className="text-danger">
                                  Invalid phone number
                                </p>
                              )}
                              {isValid && phone.trim() !== "" && (
                                <p className="text-success">
                                  Valid phone number
                                </p>
                              )}
                            </div>
                            {!sendOTP ? (
                              <div className="form-group mb-30">
                                <button
                                  type="submit"
                                  className="btn btn-fill-out btn-block hover-up font-weight-bold"
                                  onClick={(e) => handleSendOTP(e)}
                                >
                                  SEND OTP
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div className="form-group">
                                  <p>OTP has been sent to {phone}</p>
                                  <br />

                                  <OtpInput
                                    value={codeOTP}
                                    onChange={setCodeOTP}
                                    numInputs={6}
                                    inputStyle={{
                                      padding: "4px",
                                      width: "48px",
                                      margin: "0 4px",
                                    }}
                                    separator={<span>-</span>}
                                    renderInput={(props) => (
                                      <input {...props} />
                                    )}
                                    isInputNum
                                  />
                                </div>
                                <div

                                  className="form-group mb-30"
                                >
                                  <button
                                    id="recaptcha-container"
                                    className="btn btn-fill-out btn-block hover-up font-weight-bold"
                                    onClick={(e) => handleNextForm(e)}
                                  >
                                    NEXT
                                  </button>
                                </div>
                                <div></div>
                              </div>
                            )}
                          </form>
                        )}

                        {/* After OTP */}
                        {recievedOTP && (
                          <form method="post">
                            <div className="form-group">
                              <input
                                type="text"
                                required=""
                                name="username"
                                placeholder="Name"
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                required=""
                                name="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <input
                                required=""
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <input
                                required=""
                                type="password"
                                name="password"
                                placeholder="Confirm password"
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                            </div>
                            <div className="payment_option mb-50">
                              <div className="custome-radio">
                                <input
                                  className="form-check-input"
                                  required=""
                                  type="radio"
                                  name="payment_option"
                                  id="exampleRadios3"
                                  defaultChecked=""
                                  value="customer"
                                  onChange={(e) => setRole(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="exampleRadios3"
                                  data-bs-toggle="collapse"
                                  data-target="#bankTranfer"
                                  aria-controls="bankTranfer"
                                >
                                  I am a customer
                                </label>
                              </div>
                              <div className="custome-radio">
                                <input
                                  className="form-check-input"
                                  required=""
                                  type="radio"
                                  name="payment_option"
                                  id="exampleRadios4"
                                  defaultChecked=""
                                  value="vendor"
                                  onChange={(e) => setRole(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="exampleRadios4"
                                  data-bs-toggle="collapse"
                                  data-target="#checkPayment"
                                  aria-controls="checkPayment"
                                >
                                  I am a vendor
                                </label>
                              </div>
                            </div>
                            <div className="login_footer form-group mb-50">
                              <div className="chek-form">
                                <div className="custome-checkbox">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="checkbox"
                                    id="exampleCheckbox12"
                                    value=""
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleCheckbox12"
                                  >
                                    <span>I agree to terms &amp; Policy.</span>
                                  </label>
                                </div>
                              </div>
                              <Link href="/page-privacy-policy">
                                <i className="fi-rs-book-alt mr-5 text-muted"></i>
                                Lean more
                              </Link>
                            </div>
                            <div className="form-group mb-30">
                              <button
                                type="submit"
                                className="btn btn-fill-out btn-block hover-up font-weight-bold"
                                name="login"
                                onClick={(e) => handleSignUp(e)}
                              >
                                Submit &amp; Register
                              </button>
                            </div>
                          </form>
                        )}

                        <p className="font-xs text-muted p-4">
                          <strong>Note:</strong>Your personal data will be used
                          to support your experience throughout this website, to
                          manage access to your account, and for other purposes
                          described in our privacy policy
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 pr-30 d-none d-lg-block">
                    <div className="card-login mt-115">
                      <a href="#" className="social-login facebook-login">
                        <img
                          src="/assets/imgs/theme/icons/logo-facebook.svg"
                          alt="nest"
                        />
                        <span>Continue with Facebook</span>
                      </a>

                      <a
                        href="#"
                        className="social-login google-login"
                        onClick={() => signIn("google")}
                      >
                        <img
                          src="/assets/imgs/theme/icons/logo-google.svg"
                          alt="nest"
                        />
                        <span>Continue with Google</span>
                      </a>

                      <a href="#" className="social-login apple-login">
                        <img
                          src="/assets/imgs/theme/icons/logo-apple.svg"
                          alt="nest"
                        />
                        <span>Continue with Apple</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}

export default Privacy;
