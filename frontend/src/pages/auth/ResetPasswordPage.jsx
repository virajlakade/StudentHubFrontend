import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigation } from "../../context/NavigationContext";
import authService from "../../services/authService";

export default function ResetPasswordPage() {

    const { setAuthView } = useNavigation();

    const email = localStorage.getItem("resetEmail") || "";
    const otp = localStorage.getItem("resetOtp") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Please fill all fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {

            const message = await authService.resetPassword(
                email,
                otp,
                newPassword
            );

            alert(message);

            localStorage.removeItem("resetEmail");
            localStorage.removeItem("resetOtp");

            setAuthView("login");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to reset password."
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
                        Reset Password
                    </h2>

                    <p className="auth-subtitle">
                        Create a new password for
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

                    <label>New Password</label>

                    <input
                        type="password"
                        value={newPassword}
                        placeholder="Enter new password"
                        disabled={loading}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError("");
                        }}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm new password"
                        disabled={loading}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
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
                    {loading ? "Updating..." : "Reset Password"}
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