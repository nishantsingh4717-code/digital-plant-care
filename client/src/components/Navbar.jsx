
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    closeMenu();
    navigate("/login", { replace: true });
  };

  const scrollToSection = (id) => {
    closeMenu();

    if (window.location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleHome = () => {
    closeMenu();

    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMyPlants = () => {
    closeMenu();
    navigate("/my-plants");
  };

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="logo" onClick={handleHome}>
          <span className="logo-icon">🌱</span>
          <span className="logo-text">Smart Plant Care</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <button className="nav-button" onClick={handleHome}>
            Home
          </button>

          <button
            className="nav-button"
            onClick={() => scrollToSection("scanner")}
          >
            Plant Scanner
          </button>

          <button
            className="nav-button"
            onClick={() => scrollToSection("features")}
          >
            Plant Care
          </button>

          <button className="nav-button" onClick={handleMyPlants}>
            🪴 My Plants
          </button>

          <button
            className="nav-button"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          {user && (
            <span className="welcome-user">
              <span aria-hidden="true">👋</span>{" "}
              {user.name || "Gardener"}
            </span>
          )}

          {user && (
            <button className="logout-button" onClick={handleLogout}>
              Logout <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
