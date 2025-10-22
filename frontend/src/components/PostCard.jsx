import { useState } from "react";
import axios from "../api/axios";
import useAuthStore from "../store/authStore";

function PostCard({ post }) {
  const { user } = useAuthStore();
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [liked, setLiked] = useState(post.is_liked || false);
  const [error, setError] = useState("");

  const toggleLike = async () => {
    try {
      const res = await axios.post(`/posts/${post.id}/like-toggle/`);
      setLiked(res.data.liked);
      setLikes(res.data.likes_count);
    } catch (err) {
      console.error(err);
      setError("Failed to toggle like.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-2">
        <img
          src={post.author?.profile_picture || "/default-avatar.png"}
          alt={post.author?.username}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-semibold text-gray-800">{post.author?.username}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-3">{post.content}</p>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          ❤️ {likes}
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          💬 Comment
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default PostCard;
