import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
import { useNavigation } from "../../context/NavigationContext";
import authService from "../../services/authService";

export default function RegisterPage() {

  const { login } = useNavigation();

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

      await login(email, password);

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