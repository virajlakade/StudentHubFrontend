import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileCard from "../../components/profile/ProfileCard";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileStats from "../../components/profile/ProfileStats";
import "./ProfilePage.css";

export default function ProfilePage() {

  const { profile, loading, getMyPosts } = useProfile();

  const [posts, setPosts] = useState({
    confessions: [],
    lostFound: [],
    roommate: []
  });

  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {

    const loadPosts = async () => {

      try {

        const data = await getMyPosts();

        setPosts({
          confessions: data.confessions || [],
          lostFound: data.lostFound || [],
          roommate: data.roommate || []
        });

      } catch (err) {

        console.error("Error loading posts:", err);

      } finally {

        setPostsLoading(false);

      }

    };

    loadPosts();

  }, [getMyPosts]);

  if (loading || postsLoading) {

    return (
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading Profile...</p>
        </div>
    );

  }

  const stats = {
    lostFoundCount: posts.lostFound.length,
    confessionsCount: posts.confessions.length,
    roommatesCount: posts.roommate.length
  };

  return (
      <div className="profile-page-container">

        <ProfileHeader activeSubtab="overview" />

        <div className="profile-grid">

          <div className="profile-grid-column left">
            <ProfileCard profile={profile} />
          </div>

          <div className="profile-grid-column right">
            <ProfileStats stats={stats} />
            <ProfileInfo profile={profile} />
          </div>

        </div>

      </div>
  );

}