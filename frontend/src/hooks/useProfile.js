import { useState, useEffect, useCallback } from "react";
import { profileService } from "../services/profileService";

export function useProfile() {

  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {

    setLoading(true);

    try {

      const data = profileService.getProfile();
      const act = profileService.getActivityTimeline();

      setProfile(data);
      setActivities(act);

    } catch (error) {

      console.error("Error loading profile:", error);

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    refreshProfile();

  }, [refreshProfile]);

  const updateProfile = useCallback(async (updatedData) => {

    try {

      const res = profileService.updateProfile(updatedData);

      setProfile(res);

      const act = profileService.getActivityTimeline();
      setActivities(act);

      window.dispatchEvent(new Event("profile-updated"));

      return res;

    } catch (error) {

      console.error("Error updating profile:", error);
      return null;

    }

  }, []);

  const getMyPosts = useCallback(async () => {

    try {

      const [
        confessions,
        lostFound,
        roommate
      ] = await Promise.all([
        profileService.getMyConfessions(),
        profileService.getMyLostFoundPosts(),
        profileService.getMyRoommatePosts()
      ]);

      return {
        confessions: Array.isArray(confessions) ? confessions : [],
        lostFound: Array.isArray(lostFound) ? lostFound : [],
        roommate: Array.isArray(roommate) ? roommate : []
      };

    } catch (error) {

      console.error("Error loading user posts:", error);

      return {
        confessions: [],
        lostFound: [],
        roommate: []
      };

    }

  }, []);

  return {
    profile,
    activities,
    loading,
    refreshProfile,
    updateProfile,
    getMyPosts
  };

}

export default useProfile;