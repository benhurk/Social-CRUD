import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0">
      <div className="max-w-3xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Social CRUD
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
