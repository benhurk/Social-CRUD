import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthStore from "../store/authStore";
import { TiDelete } from "react-icons/ti";

function Comments({ postId, show }) {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const res = await axios.post(`/posts/${postId}/comments/`, {
        content: newComment,
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao postar comentário:", err);
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/posts/${postId}/comments/`);
        setComments(res.data.results);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId) => {
    if (!confirm("Tem certeza que deseja apagar esse comentário?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/posts/${postId}/comments/${commentId}/`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar comentário.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`mt-3 border-t pt-3 ${show ? "block" : "hidden"}`}>
      {loading ? (
        <p className="text-sm text-gray-400">Carregando comentários...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-lg shadow text-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center mb-4">
                  <img
                    src={comment.user?.profile_picture || "/default-avatar.png"}
                    alt={comment.user?.username}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {user?.id === comment.user?.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={false}
                    className="flex items-end gap-1 text-red-500 opacity-50 hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer"
                  >
                    <TiDelete className="text-2xl" />
                  </button>
                )}
              </div>
              <span className="text-gray-600">{comment.content}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Nenhum comentário ainda.</p>
      )}

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
          <textarea
            placeholder="Escreva um comentário..."
            className="flex-1 border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={deleting}
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className={`px-4 py-2 w-fit self-end text-white rounded hover:cursor-pointer text-sm ${
              posting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {posting ? "..." : "Comentar"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Comments;
