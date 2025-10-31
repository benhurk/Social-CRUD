import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { TiSocialTwitter } from "react-icons/ti";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  return (
    <nav className="border-b backdrop-blur-sm bg-[rgba(255, 255, 255, 0.3)] shadow-sm sticky top-0">
      <div className="max-w-3xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          <TiSocialTwitter className="text-5xl rotate-180" />
        </Link>
        <div className="flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <form
                className="relative"
                onSubmit={() =>
                  navigate(`/profile/${search.trim().toLowerCase()}`)
                }
              >
                <input
                  type="text"
                  placeholder="Buscar usuário"
                  className="rounded border border-gray-800 text-sm py-1 px-3 bg-white"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-1/2 text-lg hover:cursor-pointer hover:text-blue-600"
                >
                  <CiSearch />
                </button>
              </form>
              <Link
                to={`/profile/${user?.username}`}
                className="text-gray-600 hover:text-blue-500"
              >
                Perfil
              </Link>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 hover:cursor-pointer"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-500">
                Entrar
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
