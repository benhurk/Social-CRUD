import { useEffect, useState } from "react";
import axios from "../api/axios";
import PostCard from "../components/PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/posts/");
      setPosts(res.data.results);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar posts.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const res = await axios.post("/posts/", { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (err) {
      console.error(err);
      setError("Erro ao criar post.");
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handlePostSubmit}
          className="bg-white p-4 rounded-lg shadow mb-6"
        >
          <textarea
            className="w-full border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            placeholder={"O que está acontecendo?"}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            disabled={posting}
          />
          <div className="text-right mt-2">
            <button
              type="submit"
              disabled={posting || !newPost.trim()}
              className={`px-4 py-2 text-white rounded ${
                posting || !newPost.trim()
                  ? "bg-blue-400 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
              }`}
            >
              {posting ? "..." : "Postar"}
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-center text-gray-500">...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={(id) => setPosts(posts.filter((p) => p.id !== id))}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum post por aqui ainda.
          </p>
        )}
      </div>
    </div>
  );
}

export default Feed;
