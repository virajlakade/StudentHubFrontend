import React, { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { roommateService } from "../../services/roommateService";
import RoommateStats from "../../components/roommate/RoommateStats";
import RoommateList from "../../components/roommate/RoommateList";
import RoommateRequests from "../../components/roommate/RoommateRequests";
import CreateRoommatePost from "../../components/roommate/CreateRoommatePost";
import "./RoommatePage.css";

export default function RoommatePage() {

  const {
    subView,
    setSubView,
    navigateToCreate,
    navigateToList
  } = useNavigation();

  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {

      const postData = await roommateService.getPosts();
      const requestData = await roommateService.getRequests();

      setPosts(postData);
      setRequests(requestData);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  const handleCreateSubmit = async (formData) => {

    try {

      await roommateService.createPost(formData);

      await loadData();

      navigateToList();

    } catch (err) {

      console.error(err);
      alert("Failed to create roommate post.");

    }

  };

  const handleDeletePost = async (id) => {

    if (!window.confirm("Delete this listing?")) return;

    try {

      await roommateService.deletePost(id);

      await loadData();

    } catch (err) {

      console.error(err);
      alert("Unable to delete listing.");

    }

  };

  const handleConnectRequest = async (postId, message) => {

    try {

      await roommateService.sendConnectionRequest(postId, message);

      await loadData();

    } catch (err) {

      console.error(err);
      alert("Unable to send request.");

    }

  };

  const handleRequestStatusChange = async (requestId, status) => {

    try {

      await roommateService.updateRequestStatus(requestId, status);

      await loadData();

    } catch (err) {

      console.error(err);
      alert("Unable to update request.");

    }

  };

  if (loading) {

    return (
        <div className="roommate-loading">
          <div className="loading-spinner"></div>
          <p>Loading Roommate Finder...</p>
        </div>
    );

  }

  if (subView === "create") {

    return (
        <div className="roommate-page">
          <CreateRoommatePost
              onSubmit={handleCreateSubmit}
              onCancel={navigateToList}
          />
        </div>
    );

  }

  const pendingIncomingCount = requests.filter(
      (req) =>
          req.receiverEmail === "anup.sawant@studenthub.edu" &&
          req.status === "Pending"
  ).length;

  return (
      <div className="roommate-page">

        <div className="roommate-header">

          <div className="header-text-container">

            <h1 className="page-title">
              {subView === "requests"
                  ? "Connection Requests"
                  : "Roommate Finder"}
            </h1>

            <p className="page-subtitle">
              {subView === "requests"
                  ? "Manage incoming and outgoing roommate matching requests."
                  : "Match with campus peers based on shared habits, budgets, and location preferences."}
            </p>

          </div>

          <div className="header-actions">

            {subView === "requests" ? (

                <button
                    onClick={navigateToList}
                    className="btn-secondary-action"
                >
                  Back to Listings
                </button>

            ) : (

                <button
                    onClick={() => setSubView("requests")}
                    className="btn-secondary-action"
                >
                  My Requests
                  {pendingIncomingCount > 0 &&
                      <span className="action-alert-dot"></span>}
                </button>

            )}

            <button
                onClick={navigateToCreate}
                className="btn-post-requirement"
            >
              Post Requirement
            </button>

          </div>

        </div>

        <RoommateStats
            posts={posts}
            requests={requests}
        />

        <div className="roommate-content">

          {subView === "requests" ? (

              <RoommateRequests
                  requests={requests}
                  onStatusChange={handleRequestStatusChange}
              />

          ) : (

              <RoommateList
                  posts={posts}
                  requests={requests}
                  onConnect={handleConnectRequest}
                  onDelete={handleDeletePost}
              />

          )}

        </div>

      </div>
  );
}