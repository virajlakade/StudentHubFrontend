import { useState } from "react";
import "./LoginPage.css";
import { useNavigation } from "../../context/NavigationContext";

const BASE_URL = "http://localhost:8090";

export default function LoginPage() {

  const { login, setAuthView } = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      await login(email, password);

    } catch (err) {

      console.error(err);

      setError(
          err.response?.data?.message ||
          "Invalid email or password."
      );

    } finally {

      setLoading(false);

    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
        `${BASE_URL}/oauth2/authorization/google`;
  };

  const handleGithubLogin = () => {
    window.location.href =
        `${BASE_URL}/oauth2/authorization/github`;
  };

  return (
      <div className="auth-page">

        <div className="auth-card">

          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Login to StudentHub
          </p>

          {error && (
              <div className="auth-error">
                {error}
              </div>
          )}

          <form
              className="auth-form"
              onSubmit={handleSubmit}
          >

            <label>
              Email

              <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                      setEmail(e.target.value)
                  }
                  required
              />
            </label>

            <label>
              Password

              <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                      setPassword(e.target.value)
                  }
                  required
              />
            </label>

            <button
                type="submit"
                disabled={loading}
            >
              {loading
                  ? "Logging in..."
                  : "Login"}
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="oauth-buttons">

            <button
                className="oauth-btn google"
                onClick={handleGoogleLogin}
                type="button"
            >
              Continue with Google
            </button>

            <button
                className="oauth-btn github"
                onClick={handleGithubLogin}
                type="button"
            >
              Continue with GitHub
            </button>

          </div>

          <p className="auth-footer">

            Don't have an account?

            <button
                type="button"
                className="link-btn"
                onClick={() =>
                    setAuthView("register")
                }
            >
              Register
            </button>

          </p>

        </div>

      </div>
  );
}