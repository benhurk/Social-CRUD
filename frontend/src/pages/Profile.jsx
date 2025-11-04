import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import useAuthStore from "../store/authStore";
import PostCard from "../components/PostCard";

function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`/auth/users/${username}/`);
      setProfile(res.data);
      setFollowing(res.data.is_following);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
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
      console.error("Erro ao alterar follow:", err);
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
      <div className="flex items-center gap-4 mb-10">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.username}
          className="w-25 h-25 rounded-full object-cover"
        />
        <div className="flex justify-between w-full">
          <div>
            <h1 className="text-xl font-semibold">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-gray-600">@{profile.username}</p>
            <p className="text-sm text-gray-700 mt-2 mb-2">{profile.bio}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <Link
                to={`/profile/${profile.username}/followers`}
                className="hover:text-gray-800"
              >
                {profile.followers_count} Seguidores
              </Link>
              <Link
                to={`/profile/${profile.username}/following`}
                className="hover:text-gray-800"
              >
                {profile.following_count} Seguindo
              </Link>
            </div>
          </div>
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`h-fit self-end mt-2 px-4 py-1 rounded text-white text-sm hover:cursor-pointer ${
                following
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {following ? "Seguindo" : "Seguir"}
            </button>
          )}

          {isOwnProfile && (
            <button
              onClick={() => navigate("/edit-profile")}
              className="h-fit self-end mt-2 px-4 py-1 rounded text-white text-sm bg-gray-700 hover:cursor-pointer hover:bg-gray-800"
            >
              Editar perfil
            </button>
          )}
        </div>
      </div>

      {profile.posts.length > 0 ? (
        <div className="space-y-4 border-t border-gray-200 pt-10">
          {profile.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Nada postado ainda.</p>
      )}
    </div>
  );
}

export default Profile;
