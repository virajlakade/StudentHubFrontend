import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigation } from "../../context/NavigationContext";
import authService from "../../services/authService";

export function VerifyEmailPage() {
  const { setAuthView, emailToVerify } = useNavigation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const targetEmail = emailToVerify || "your student email";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Temporary verification until backend API is implemented
      if (code !== "123456") {
        throw new Error("Invalid verification code.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <AuthLayout>
          <div className="auth-form">
            <div className="auth-header-info">
              <h2 className="auth-title">Email Verified!</h2>
              <p className="auth-subtitle">
                Your student account is now active.
              </p>
            </div>

            <div className="auth-success-banner">
              ✨ Your email has been verified successfully.
            </div>

            <button
                className="btn-auth-submit"
                onClick={() => setAuthView("login")}
                style={{ width: "100%" }}
            >
              Go to Login
            </button>
          </div>
        </AuthLayout>
    );
  }

  return (
      <AuthLayout>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-header-info">
            <h2 className="auth-title">Verify Email</h2>
            <p className="auth-subtitle">
              Enter the verification code sent to
              <br />
              <strong>{targetEmail}</strong>
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="code">Verification Code</label>

            <input
                id="code"
                type="text"
                value={code}
                maxLength={6}
                disabled={loading}
                placeholder="123456"
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                style={{
                  textAlign: "center",
                  letterSpacing: "8px",
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
            <span>Didn't receive the code?</span>

            <button
                type="button"
                className="auth-link"
                disabled={loading}
                onClick={() =>
                    alert(`Verification code has been resent to ${targetEmail}`)
                }
            >
              Resend Code
            </button>
          </div>
        </form>
      </AuthLayout>
  );
}

export default VerifyEmailPage;