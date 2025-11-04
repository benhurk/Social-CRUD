import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "../api/axios";

function FollowList() {
  const { username } = useParams();
  const location = useLocation();

  const isFollowers = location.pathname.includes("followers");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const endpoint = isFollowers
          ? `/auth/users/${username}/followers/`
          : `/auth/users/${username}/following/`;
        const res = await axios.get(endpoint);
        setList(res.data);
      } catch (err) {
        console.error("Erro ao carregar lista de seguidores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [username, isFollowers]);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">
        {isFollowers ? "Seguidores" : "Seguindo"}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {list.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-3 not-first:border-t border-gray-300 py-4"
            >
              <Link
                to={`/profile/${u.username}`}
                className="flex items-center gap-3 flex-1"
              >
                <img
                  src={u.avatar || "/default-avatar.png"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{u.display_name || u.username}</p>
                  <p className="text-gray-500 text-sm">@{u.username}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FollowList;
