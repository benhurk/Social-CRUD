import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import Navbar from "./components/NavBar";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Feed from "./pages/Feed";
// import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";

function App() {
  const { isAuthenticated, user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser();
    }
  }, [isAuthenticated, user, fetchUser]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Feed /> : <Navigate to="/login" />}
          />
          {/*
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*
                     <Route path="*" element={<NotFound />} />
            */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
