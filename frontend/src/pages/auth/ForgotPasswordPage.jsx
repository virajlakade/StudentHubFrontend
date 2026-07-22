import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigation } from "../../context/NavigationContext";
import authService from "../../services/authService";

export default function ForgotPasswordPage() {

  const { setAuthView } = useNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const message = await authService.forgotPassword(email);

      // Save email for Verify OTP page
      localStorage.setItem("resetEmail", email);

      alert(message);

      setAuthView("verifyOtp");

    } catch (err) {

      console.error(err);

      setError(
          err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to send OTP."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

      <AuthLayout>

        <form
            className="auth-form"
            onSubmit={handleSubmit}
        >

          <div className="auth-header-info">

            <h2 className="auth-title">
              Forgot Password
            </h2>

            <p className="auth-subtitle">
              Enter your registered email address to receive a verification OTP.
            </p>

          </div>

          {error && (
              <div className="auth-error-banner">
                {error}
              </div>
          )}

          <div className="form-group">

            <label>Email Address</label>

            <input
                type="email"
                value={email}
                placeholder="Enter your registered email"
                disabled={loading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
            />

          </div>

          <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="auth-footer-prompt">

            <span>Remember your password?</span>

            <button
                type="button"
                className="auth-link"
                disabled={loading}
                onClick={() => setAuthView("login")}
            >
              Login
            </button>

          </div>

        </form>

      </AuthLayout>

  );
}