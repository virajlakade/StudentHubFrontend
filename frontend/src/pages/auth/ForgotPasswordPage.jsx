import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigation } from "../../context/NavigationContext";
import authService from "../../services/authService";

export function ForgotPasswordPage() {
  const { setAuthView } = useNavigation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your institutional email.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      authService.forgotPassword(email);
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Failed to submit recovery request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {success ? (
        <div className="auth-form">
          <div className="auth-header-info">
            <h2 className="auth-title">Check Your Email</h2>
            <p className="auth-subtitle">Recovery instructions sent successfully.</p>
          </div>

          <div className="auth-success-banner">
            🔑 Password reset instructions and recovery link have been sent to <strong>{email}</strong>. Please follow the instructions to secure your account.
          </div>

          <button
            type="button"
            onClick={() => setAuthView("login")}
            className="btn-auth-submit"
            style={{ width: "100%" }}
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-header-info">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Enter your institutional email to recover access.</p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="recovery-email">Institutional Email</label>
            <input
              type="email"
              id="recovery-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="e.g. student@studenthub.edu"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner"></span> : "Send Recovery Link"}
          </button>

          <div className="auth-footer-prompt">
            <span>Remembered password?</span>
            <button
              type="button"
              onClick={() => setAuthView("login")}
              className="auth-link"
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
