import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function EditProfile() {
  const { user, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        display_name: user.display_name || "",
        bio: user.bio || "",
        avatar: null,
      });
      setPreview(user.avatar || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files.length > 0) {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") form.append(key, value);
    });

    try {
      await axios.patch("/auth/profile/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUser();
      navigate("/profile/" + user.username);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChanging(true);
    setPasswordError("");
    setPasswordMessage("");

    try {
      await axios.post("/auth/profile/change-password/", passwordData);
      setPasswordMessage("Senha alterada com sucesso.");
      setPasswordData({ old_password: "", new_password: "" });
    } catch (err) {
      if (err.response?.data?.old_password) {
        setPasswordError("Senha atual incorreta.");
      } else if (err.response?.data?.new_password) {
        setPasswordError("Nova senha inválida.");
      } else {
        setPasswordError("Erro ao alterar senha.");
      }
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Editar pefil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Foto
          </label>
          <div className="mt-2 flex items-center gap-4">
            <img
              src={preview || "/default-avatar.png"}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-full"
            />
            <label
              htmlFor="avatar"
              className="bg-gray-800 py-1 px-2 text-white text-sm rounded hover:cursor-pointer hover:bg-gray-700"
            >
              Carregar foto
            </label>
            <input
              type="file"
              className="hidden"
              placeholder="Carregar"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 w-full h-12 resize-none border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 text-white rounded hover:cursor-pointer ${
            saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "..." : "Salvar"}
        </button>
      </form>

      <div className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Mudar senha</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha atual
            </label>
            <input
              type="password"
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
              className="mt-1 w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nova senha
            </label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              className="mt-1 w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="text-green-600 text-sm">{passwordMessage}</p>
          )}

          <button
            type="submit"
            disabled={changing}
            className={`w-full py-2 text-white rounded ${
              changing
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
            }`}
          >
            {changing ? "..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
