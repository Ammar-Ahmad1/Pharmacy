"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { signIn, getProviders, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import OtpInput from "react18-input-otp";
import AuthCode from "react-auth-code-input";
import { useRouter } from "next/navigation";

function Privacy({
  setShowLoginForm,
  showLoginForm,
}) {
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
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(120);
  const [loading, setLoading] = useState(false);

  // const [providers, setProviders] = useState(null);

  const loginUser = async (phone, password) => {
    if (!phone || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      phone: phone,
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
          router.push("/shop-checkout");
        } // Redirect to home page if logged in
        else if (session.user.role === "vendor")
          router.push("/vendor-dashboard");
        // router.push("/");
      }
    }
    setLoading(false);
  };

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
      setIsSigningUp(true);
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
          // router.push("/page-login");
          loginUser(phone,password);
          if (data.error) {
            console.log(data.error);
          } else {
            console.log(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        }).finally(() => {
          setIsSigningUp(false);
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
    setIsSendingOTP(true);
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
        setCountdown(60);
        setIsDisabled(true);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP");
    } finally {
      setIsSendingOTP(false); // Set loading state back to false when done
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

  // OTP countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [countdown]);
  return (
    <div className="panel-body ms-1 col-xss-12 col-md-6">
      <h2 className="mb-4">Signup</h2>
      {/* Before OTP */}
      {!recievedOTP && (
        <form method="post">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              required
              aria-required
              placeholder="03xxxxxxxxx"
              value={phone}
              name="phone-number"
              onChange={handlePhoneNumberChange}
            // className={isValid ? "valid" : "invalid"}
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
                className="btn btn-md font-sm"
                onClick={(e) => handleSendOTP(e)}
                disabled={isSendingOTP} // Disable the button when loading
              >
                {isSendingOTP ? "Sending OTP..." : "Send OTP"}
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
                  renderInput={(props) => (
                    <input {...props} />
                  )}
                  isInputNum
                />
                <br />
                <button onClick={handleSendOTP} className="btn btn-heading btn-block" disabled={isDisabled}>
                  {isDisabled ? 'Send OTP' : 'Send OTP'}
                </button>
                {isDisabled && <p> {`Resend OTP in ${countdown} seconds`} </p>}
                <br />
              </div>
              <div

                className="form-group mb-30"
              >
                <button
                  id="recaptcha-container"
                  className="btn btn-fill-out btn-block font-weight-bold"
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
            <label>Full Name</label>
            <input
              type="text"
              required=""
              name="username"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              required=""
              name="email"
              placeholder="example@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              required=""
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
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
              className="btn"
              name="login"
              onClick={(e) => handleSignUp(e)}
              disabled={
                isSigningUp
              } // Disable the button when loading
            >
              {isSigningUp ? "Signing up..." : "Register"}
              {/* Submit &amp; Register */}
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
  );
}

export default Privacy;
