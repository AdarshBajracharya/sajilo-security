import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    toast.info("Logging out...");
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <Link to="/" className="logo-link">
        <img src="/Assets/sajilo.png" alt="Sajilo" className="logo" />
      </Link>

      <nav className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
          Home
        </Link>

        {user && (
          <>
            <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
              Profile
            </Link>
            <Link to="/orders" className={`nav-link ${location.pathname === "/orders" ? "active" : ""}`}>
              Orders
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin/dashboard/products"
                className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
              >
                Admin
              </Link>
            )}
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <Link to="/cart" className="cart-icon">
          <FaCartShopping size={24} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {user && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
