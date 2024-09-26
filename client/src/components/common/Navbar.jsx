import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg fixed">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          TradeVista
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-3">
          <li>
            <Link to="/client-login" className="btn btn-sm btn-accent">
              Client Login
            </Link>
          </li>
          {/*
            <li>
              <Link to="/admin-login" className="btn btn-sm btn-neutral">
                Admin Login
              </Link>
            </li>
          */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
