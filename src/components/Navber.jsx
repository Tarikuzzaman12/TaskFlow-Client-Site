import  { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Navber = () => {
  const { user, signOutUser } = useContext(AuthContext); 
  const handleSignout = () => {
    signOutUser()
      .then(() => console.log("User signed out successfully"))
      .catch((error) => console.error("Sign-out failed:", error.message));
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              {user ? (
                <li>
                  <Link to="/" className="btn btn-ghost">Dashboard</Link>
                </li>
              ) : (
                <li>
                  <Link to="/login" className="btn btn-ghost">Login</Link>
                </li>
              )}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">TaskFlow</a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {user ? (
              <li>
                <Link to="/" className="btn btn-ghost">Dashboard</Link>
              </li>
            ) : (
              <li>
                <Link to="/login" className="btn btn-ghost">Login</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="navbar-end">
          {user ? (
            <Link 
            onClick={handleSignout} to="/login" className="btn">Logout</Link>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navber;
