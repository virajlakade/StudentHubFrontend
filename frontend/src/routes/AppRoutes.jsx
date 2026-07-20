import { useEffect } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";

import LostFoundPage from "../pages/lost-found/LostFoundPage";
import CreatePostPage from "../pages/lost-found/CreatePostPage";
import LostFoundDetails from "../pages/lost-found/LostFoundDetails";

import ConfessionFeedPage from "../pages/confessions/ConfessionFeedPage";
import CreateConfessionPage from "../pages/confessions/CreateConfessionPage";
import ConfessionDetailsPage from "../pages/confessions/ConfessionDetailsPage";

import ProfilePage from "../pages/profile/ProfilePage";
import EditProfilePage from "../pages/profile/EditProfilePage";
import MyPostsPage from "../pages/profile/MyPostsPage";
import SettingsPage from "../pages/profile/SettingsPage";

import AttendancePage from "../pages/attendance/AttendancePage";
import AttendanceDetailsPage from "../pages/attendance/AttendanceDetailsPage";

import PlacementFeedPage from "../pages/placement/PlacementFeedPage";
import AddExperiencePage from "../pages/placement/AddExperiencePage";

import RoommatePage from "../pages/roommate/RoommatePage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

import authService from "../services/authService";
import { useNavigation } from "../context/NavigationContext";

export default function AppRoutes() {

  const {
    activeTab,
    subView,
    user,
    setUser,
    authView,
    setActiveTab
  } = useNavigation();

  // ================= OAUTH LOGIN =================

  useEffect(() => {

    const handleOAuthLogin = async () => {

      const params = new URLSearchParams(window.location.search);

      const token = params.get("token");

      if (!token) return;

      try {

        const profile =
            await authService.saveOAuthLogin(token);

        setUser(profile);

        setActiveTab("Dashboard");

        window.history.replaceState(
            {},
            document.title,
            "/"
        );

      } catch (e) {

        console.error("OAuth Login Failed", e);

        authService.logout();

      }

    };

    handleOAuthLogin();

  }, []);

  // ================= AUTH =================

  if (!user) {

    switch (authView) {

      case "register":
        return <RegisterPage />;

      case "forgot-password":
        return <ForgotPasswordPage />;

      case "verify-email":
        return <VerifyEmailPage />;

      case "login":
      default:
        return <LoginPage />;

    }

  }

  let page;

  switch (activeTab) {

    case "Dashboard":
      page = <Dashboard />;
      break;

    case "Lost & Found":
      if (subView === "create") {
        page = <CreatePostPage />;
      } else if (subView === "details") {
        page = <LostFoundDetails />;
      } else {
        page = <LostFoundPage />;
      }
      break;

    case "Anonymous Confessions":
      if (subView === "create") {
        page = <CreateConfessionPage />;
      } else if (subView === "details") {
        page = <ConfessionDetailsPage />;
      } else {
        page = <ConfessionFeedPage />;
      }
      break;

    case "Attendance Tracker":
      page =
          subView === "details"
              ? <AttendanceDetailsPage />
              : <AttendancePage />;
      break;

    case "Placement Portal":
      page =
          subView === "create"
              ? <AddExperiencePage />
              : <PlacementFeedPage />;
      break;

    case "Profile":
      if (subView === "edit") {
        page = <EditProfilePage />;
      } else if (subView === "posts") {
        page = <MyPostsPage />;
      } else {
        page = <ProfilePage />;
      }
      break;

    case "Settings":
      page = <SettingsPage />;
      break;

    case "Roommate Finder":
      page = <RoommatePage />;
      break;

    default:
      page = (
          <div
              className="under-construction"
              style={{
                padding: "64px 32px",
                textAlign: "center",
              }}
          >
            <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#fff",
                }}
            >
              {activeTab}
            </h2>

            <p style={{ color: "var(--muted)" }}>
              This section is currently under construction.
            </p>
          </div>
      );

  }

  return (
      <DashboardLayout>
        {page}
      </DashboardLayout>
  );

}