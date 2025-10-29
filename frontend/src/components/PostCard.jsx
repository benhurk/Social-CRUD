import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthStore from "../store/authStore";
import { FcLike } from "react-icons/fc";
import { FaCommentAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

function PostCard({ post, onDelete }) {
  const { user } = useAuthStore();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchLike = async () => {
      const res = await axios.get(`/posts/${post.id}/like/`);

      setLikes(res.data.likes_count);
      setLiked(res.data.is_liked);
    };

    fetchLike();
  }, [post.id]);

  const toggleLike = async () => {
    try {
      const res = await axios.post(`/posts/${post.id}/like/`);
      setLiked(!liked);
      setLikes(res.data.likes_count);
      console.log(res);
    } catch (err) {
      console.error(err);
      setError("Erro ao curtir post.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja apagar esse post?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/posts/${post.id}/`);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error(err);
      setError("Erro ao apagar post.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-4">
          <img
            src={post.author?.profile_picture || "/default-avatar.png"}
            alt={post.author?.username}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold text-gray-800">
              {post.author?.username}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {user?.id === post.author?.id && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-end gap-1 text-red-500 opacity-50 hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer"
          >
            <TiDelete className="text-2xl" />
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      <div className="flex items-center gap-8 text-sm">
        <button
          onClick={toggleLike}
          className={`flex items-end gap-1 hover:cursor-pointer ${!liked && "opacity-50"}  hover:opacity-100 transition-opacity duration-200`}
        >
          <FcLike className="text-2xl" /> {likes}
        </button>
        <button className="flex items-end gap-1 text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-colors duration-200">
          <FaCommentAlt className="text-xl" /> Comentar
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default PostCard;
