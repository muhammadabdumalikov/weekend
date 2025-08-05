import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.wetrippo.com/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Store the token in localStorage or use your preferred state management
        if (data.accessToken) {
          localStorage.setItem("authToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        
        // Redirect to dashboard or home page
        router.push("/dashboard/db-dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="row y-gap-20" onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 className="text-22 fw-500">Welcome back</h1>
        <p className="mt-10">
          Don&apos;t have an account yet?{" "}
          <Link href="/others-pages/signup" className="text-blue-1">
            Sign up for free
          </Link>
        </p>
      </div>
      {/* End .col */}

      {error && (
        <div className="col-12">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      <div className="col-12">
        <div className="form-input ">
          <input 
            type="text" 
            name="login"
            value={formData.login}
            onChange={handleInputChange}
            required 
          />
          <label className="lh-1 text-14 text-light-1">Email or Username</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input ">
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required 
          />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <a href="#" className="text-14 fw-500 text-blue-1 underline">
          Forgot your password?
        </a>
      </div>
      {/* End .col */}

      <div className="col-12">
        <button
          type="submit"
          disabled={isLoading}
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Signing In...
            </>
          ) : (
            <>
              Sign In <div className="icon-arrow-top-right ml-15" />
            </>
          )}
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default LoginForm;
