import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import authService from "../../services/authService";
import { useNavigation } from "../../context/NavigationContext";

export default function VerifyEmailPage() {

  const {
    emailToVerify,
    setAuthView,
  } = useNavigation();

  const email = emailToVerify;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const response = await authService.verifyEmail(email, otp);

      setSuccess(
          response.message || "Email verified successfully!"
      );

      setTimeout(() => {
        setAuthView("login");
      }, 1500);

    } catch (err) {

      setError(
          err.response?.data?.message ||
          err.message ||
          "Verification failed."
      );

    } finally {

      setLoading(false);

    }
  };

  const handleResend = async () => {

    if (!email) {
      setError("Email not found.");
      return;
    }

    try {

      setResending(true);
      setError("");
      setSuccess("");

      const response = await authService.resendVerification(email);

      setSuccess(
          response.message || "Verification code sent successfully."
      );

    } catch (err) {

      setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to resend verification code."
      );

    } finally {

      setResending(false);

    }
  };

  return (
      <AuthLayout>

        <form
            className="auth-form"
            onSubmit={handleVerify}
        >

          <div className="auth-header-info">
            <h2 className="auth-title">
              Verify Email
            </h2>

            <p className="auth-subtitle">
              Enter the verification code sent to
              <br />
              <strong>{email}</strong>
            </p>
          </div>

          {error && (
              <div className="auth-error-banner">
                {error}
              </div>
          )}

          {success && (
              <div className="auth-success-banner">
                {success}
              </div>
          )}

          <div className="form-group">
            <label htmlFor="otp">
              Verification Code
            </label>

            <input
                id="otp"
                type="text"
                value={otp}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                disabled={loading}
                onChange={(e) => {
                  setOtp(
                      e.target.value.replace(/\D/g, "")
                  );
                  setError("");
                }}
                style={{
                  textAlign: "center",
                  letterSpacing: "6px",
                  fontSize: "18px",
                }}
                required
            />
          </div>

          <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="auth-footer-prompt">

          <span>
            Didn't receive the code?
          </span>

            <button
                type="button"
                className="auth-link"
                disabled={resending}
                onClick={handleResend}
            >
              {resending
                  ? "Sending..."
                  : "Resend Code"}
            </button>

          </div>

        </form>

      </AuthLayout>
  );
}