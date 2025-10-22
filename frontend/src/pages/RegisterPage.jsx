import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      setError("Preencha todos os campos para prosseguir.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email inválido.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caractéres.");
      return false;
    }

    if (formData.password !== formData.password2) {
      setError("As senhas não batem.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("/auth/register/", formData);
      setSuccess("Registrado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const data = err.response.data;
        const firstError =
          Object.values(data)
            .flat()
            .find((msg) => typeof msg === "string") || "Registration failed.";
        setError(firstError);
      } else {
        setError("Não foi possível criar a conta. Tente novamente depois.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-[25%]">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Criar Conta
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Nome de usuário"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            name="password2"
            type="password"
            placeholder="Confirmar Senha"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password2}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded transition ${
              loading
                ? "bg-blue-400 cursor-default"
                : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
            }`}
          >
            {loading ? "..." : "Criar Conta"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
