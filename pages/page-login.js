"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import { signIn, getProviders, useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const router = useRouter();
  // const [isLogged, setIsLogged] = useState(false);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const getProvidersData = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    getProvidersData();
  }, []);
  useEffect(() => {
    if (session) {
      console.log(session.user.role);
      toast.success("You are already logged in");
      if (session.user.role === "customer")
        router.push("/"); // Redirect to home page if logged in
      else if (session.user.role === "vendor") router.push("/vendor-dashboard");
    }
  }, [session]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      phone,
      password,
    });
    if (result.error) {
      setError(result.error);
      toast.error("Invalid credentials");
    } else {
      toast.success("Logged in successfully");
      console.log(result);
      if (session) {
        if (session.user.role === "customer")
          router.push("/"); // Redirect to home page if logged in
        else if (session.user.role === "vendor")
          router.push("/vendor-dashboard");
        // router.push("/");
      }
    }
    setLoading(false);
  };
  const [isValid, setIsValid] = useState(false);
  const [phone, setPhone] = useState("");
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
      <Layout parent="Home" sub="Pages" subChild="Login & Register">
        <div className="page-content pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 pr-30 d-none d-lg-block">
                    <img
                      className="border-radius-15"
                      src="assets/imgs/page/login-1.png"
                      alt="nest"
                      loading="lazy"
                    />
                  </div>
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1">
                          <h1 className="mb-5">Login</h1>
                          <p className="mb-30">
                            Don't have an account?{" "}
                            <Link href="/page-register">Create here</Link>
                          </p>
                        </div>
                        <form method="post">
                          <div className="form-group">
                            <label>Phone Number</label>
                            <input
                              type="text"
                              required
                              aria-required
                              value={phone}
                              name="phone-number"
                              onChange={handlePhoneNumberChange}
                              placeholder="03xxxxxxxxx"
                            // className={isValid ? "valid" : "invalid"}
                            />

                            {!isValid && phone.trim() !== "" && (
                              <p className="text-danger">
                                Invalid phone number
                              </p>
                            )}
                            {isValid && phone.trim() !== "" && (
                              <p className="text-success">Valid phone number</p>
                            )}
                          </div>
                          <div className="form-group mb-40">
                            <label>Password</label>
                            <div className="password-input">
                              <input
                                required=""
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Your password *"
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <div className="custome-checkbox">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="showpassword"
                                  checked={showPassword}
                                  onChange={() => setShowPassword(!showPassword)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="showpassword"
                                >
                                  <span>Show Password</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* <div className="login_footer form-group">
                                                    <div className="chek-form">
                                                        <input type="text" required="" name="email" placeholder="Security code *" />
                                                    </div>
                                                    <span className="security-code">
                                                        <b className="text-new">8</b>
                                                        <b className="text-hot">6</b>
                                                        <b className="text-sale">7</b>
                                                        <b className="text-best">5</b>
                                                    </span>
                                                </div> */}
                          <div className="login_footer form-group mb-20">
                            <div className="chek-form">
                              <div className="custome-checkbox">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="checkbox"
                                  id="exampleCheckbox1"
                                  value=""
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="exampleCheckbox1"
                                >
                                  <span>Remember me</span>
                                </label>
                              </div>
                            </div>
                            <Link className="text-muted" href="/forget-password">
                              Forgot password?
                            </Link>
                          </div>
                          <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-heading btn-block"
                              name="login"
                              onClick={handleSubmit}
                              disabled={loading}
                            >
                              {loading ? "Loading..." : "Login"}
                            </button>
                          </div>
                        </form>
                      </div>
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

export default Login;
