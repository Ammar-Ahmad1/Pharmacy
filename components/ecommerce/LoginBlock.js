
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn, getProviders } from "next-auth/react";

export default function LoginBlock() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    if (!loginEmail || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      phone: loginEmail,
      password,
    });
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully");
      setShowLoginForm(false);
      if (session && session.user.role === "vendor") {
        router.push("/vendor-dashboard");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const getProvidersData = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    getProvidersData();
  }, []);

  return (
    <div className="panel-body col-xss-12 col-md-6">
      <h2 className="mb-4">Login</h2>
      <p className="mb-30 font-sm">
        If you have shopped with us before, please enter your details below.
        If you are a new customer, please proceed to the Billing & Shipping
        section.
      </p>
      <form method="post">
        <div className="form-group">
          <label>Phone Number*</label>
          <input
            type="text"
            name="email"
            placeholder="03xxxxxxxxx"
            onChange={(e) => {
              setLoginEmail(e.target.value);
            }}
            value={loginEmail}
          />
        </div>
        <div className="form-group">
          <label>Password*</label>
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
              <label className="form-check-label" htmlFor="remember">
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
  );
}
