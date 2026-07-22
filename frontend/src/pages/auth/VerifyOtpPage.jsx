import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigation } from "../../context/NavigationContext";
import authService from "../../services/authService";

export default function VerifyOtpPage() {

    const { setAuthView } = useNavigation();

    const email = localStorage.getItem("resetEmail") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);
        setError("");

        try {

            const message = await authService.verifyOtp(email, otp);

            localStorage.setItem("resetOtp", otp);

            alert(message);

            setAuthView("resetPassword");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Invalid OTP."
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
                        Verify OTP
                    </h2>

                    <p className="auth-subtitle">
                        Enter the 6-digit OTP sent to
                        <br />
                        <strong>{email}</strong>
                    </p>

                </div>

                {error && (
                    <div className="auth-error-banner">
                        {error}
                    </div>
                )}

                <div className="form-group">

                    <label>OTP</label>

                    <input
                        type="text"
                        value={otp}
                        maxLength={6}
                        disabled={loading}
                        placeholder="123456"
                        onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, ""));
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
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="auth-footer-prompt">

                    <span>Didn't receive the OTP?</span>

                    <button
                        type="button"
                        className="auth-link"
                        disabled={loading}
                        onClick={() => setAuthView("forgotPassword")}
                    >
                        Resend OTP
                    </button>

                </div>

            </form>

        </AuthLayout>

    );
}