import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import useAuthStore from "../store/authStore";
import PostCard from "../components/PostCard";

function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`/auth/users/${username}/`);
      setProfile(res.data);
      setFollowing(res.data.is_following);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      await axios.post(`/auth/users/${username}/follow-toggle/`);
      setFollowing(!following);
      fetchProfile();
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, fetchProfile]);

  if (loading)
    return <p className="text-center text-gray-500">Carregando perfil...</p>;
  if (!profile)
    return <p className="text-center text-gray-500">Perfil não encontrado.</p>;

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.username}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-semibold">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-gray-600">@{profile.username}</p>
          <div className="flex gap-4 mt-1 text-sm text-gray-600">
            <span>{profile.followers_count} Seguidores</span>
            <span>{profile.following_count} Seguindo</span>
          </div>
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`mt-2 px-4 py-1 rounded text-white text-sm hover:cursor-pointer ${
                following ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {following ? "Seguindo" : "Seguir"}
            </button>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Posts</h2>
      {profile.posts.length > 0 ? (
        <div className="space-y-4">
          {profile.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nada postado ainda.</p>
      )}
    </div>
  );
}

export default Profile;
