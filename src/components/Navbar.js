import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar({ handleSignOut, authenticatedUser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const submenuRef = useRef(null);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignButtonClick = () => {
    if (authenticatedUser) {
      handleSignOut();
      navigate("/signin");
    } else {
      navigate("/signin");
    }
  };

  const handleClickOutside = (event) => {
    if (submenuRef.current && !submenuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">TDR SOFTWARE</div>
        {isMenuOpen ? (
          <FaTimes className="menu-icon" onClick={handleToggleMenu} />
        ) : (
          <FaBars className="menu-icon" onClick={handleToggleMenu} />
        )}
        <ul
          className={`navbar-menu ${isMenuOpen ? "active" : ""}`}
          ref={submenuRef}
        >
          <li>
            {authenticatedUser ? (
              <Link to="/accounts">Create Account</Link>
            ) : null}
          </li>
          <li>
            {authenticatedUser ? (
              <Link to="/transactions">Create Transaction</Link>
            ) : null}
          </li>
          <li>
            {authenticatedUser ? (
              <Link to="/accounts-report">Accounts Report</Link>
            ) : null}
          </li>
          <li>
            {authenticatedUser ? (
              <Link to="/transactions-report">Transactions Report</Link>
            ) : null}
          </li>
          <li>
            <button className="btn-secondary" onClick={handleSignButtonClick}>
              {authenticatedUser ? "Sign Out" : "Sign In"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
