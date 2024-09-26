import Navbar from "@components/common/Navbar.jsx";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-5">
              Welcome to Portfolio Management
            </h1>
            <p className="mb-8">
              Manage your investments efficiently and stay on top of your
              portfolio with real-time insights and powerful tools.
            </p>
            <div className="space-x-4">
              <Link to="/client-login" className="btn btn-accent">
                Client Login
              </Link>
              {/*
                <Link to="/admin-login" className="btn btn-neutral">
                  Admin Login
                </Link>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LandingPage;
