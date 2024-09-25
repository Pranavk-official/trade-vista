import { useState } from "react";
import { apiCall } from "../../services/api";
import Navbar from "@components/common/Navbar.jsx";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await apiCall("/auth/forgot-password", "POST", { email });
      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      console.log(err);
      setError("Failed to send password reset link. Please try again.");
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
              Forgot Password
            </h2>
            {message && <p className="text-success mb-4">{message}</p>}
            {error && <p className="text-error mb-4">{error}</p>}

            <div className="form-control">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
