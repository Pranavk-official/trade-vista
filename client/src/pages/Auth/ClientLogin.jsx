import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiCall } from "../../services/api";
import Navbar from "@components/common/Navbar.jsx";

export const ClientLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("Please enter both user ID and password.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await apiCall("/auth/login", "POST", {
        userId,
        password,
      });
      login({ role: "client", userId }, response.token);
      navigate("/client");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Navigate to the forgot password page
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="card w-full max-w-sm shadow-2xl bg-base-100 p-6"
        >
          <h2 className="card-title text-center text-2xl mb-4">Client Login</h2>

          {error && <p className="text-error mb-4">{error}</p>}

          <div className="form-control mb-4">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleForgotPassword}
              className="link link-primary"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
