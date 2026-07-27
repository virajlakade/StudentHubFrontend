import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
import authService from "../../services/authService";
import { useNavigation } from "../../context/NavigationContext";

export default function RegisterPage() {

  const {
    setAuthView,
    setEmailToVerify,
  } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterSubmit = async (
      fullName,
      email,
      password
  ) => {

    setLoading(true);
    setError("");

    try {

      await authService.register({
        fullName,
        email,
        password,
        phone: "",
        branch: "",
        yearOfStudy: 1,
        rollNumber: "",
        degreeProgram: "",
      });

      // Save email for verification page
      setEmailToVerify(email);

      // Open Verify Email page
      setAuthView("verifyEmail");

    } catch (err) {

      console.error(err);

      setError(
          err.response?.data?.message ||
          err.message ||
          "Registration failed."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
      <AuthLayout>
        <RegisterForm
            onSubmit={handleRegisterSubmit}
            loading={loading}
            error={error}
        />
      </AuthLayout>
  );
}