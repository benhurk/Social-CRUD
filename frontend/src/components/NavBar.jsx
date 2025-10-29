import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { TiSocialTwitter } from "react-icons/ti";

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="border-b backdrop-blur-sm bg-[rgba(255, 255, 255, 0.3)] shadow-sm sticky top-0">
      <div className="max-w-3xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          <TiSocialTwitter className="text-5xl rotate-180" />
        </Link>
        <div className="flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-blue-500">
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
