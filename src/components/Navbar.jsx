import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import axiosInstance from "../api/axiosInstance";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jwt } = useSelector((state) => state.auth);

 
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    if (jwt) {
      axiosInstance
        .get("/users/profile")
        .then((res) => setIsAdmin(res.data.role === "ADMIN"))
        .catch(() => setIsAdmin(false))
        .finally(() => setRoleChecked(true));
    } else {
      setIsAdmin(false);
      setRoleChecked(true);
    }
  }, [jwt]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

 

 

  const traderLinks = [
    { to: "/portfolio", label: "Portfolio" },
    { to: "/wallet", label: "Wallet" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/activity", label: "Activity" },
    { to: "/profile", label: "Profile" },
  ];

  return (
<nav className="sticky top-0 z-40 glass rounded-none border-x-0 border-t-0 px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.3)]">     <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform">
          X
        </div>
        <span className="text-lg font-bold text-white">CryptoX</span>
        {isAdmin && (
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">
            ADMIN
          </span>
        )}
      </Link>

      <div className="flex items-center gap-3">

        {jwt ? (
          <>
            {roleChecked && !isAdmin && (
<div className="hidden md:flex items-center gap-2">                {traderLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {roleChecked && isAdmin && (
              <Link
                to="/admin"
className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
className="btn-secondary text-sm"            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-glow text-sm">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;