import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../../services/api";
import Navbar from "@components/common/Navbar.jsx";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await apiCall(`/auth/reset-password/${token}`, "POST", { password });
      setMessage("Password has been reset successfully.");
    } catch (err) {
      console.log(err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="card w-full max-w-sm shadow-2xl bg-base-100"
        >
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl">
              Reset Password
            </h2>
            {message && <p className="text-success mb-4">{message}</p>}
            {error && <p className="text-error mb-4">{error}</p>}

            <div className="form-control">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="input input-bordered"
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordForm;
