import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4">Unauthorized Access</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <Link to="/" className="btn btn-wide">
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
