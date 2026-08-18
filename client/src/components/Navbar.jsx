import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("User data error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login", { replace: true });
  };

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleHome = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScanner = () => {
    scrollToSection("scanner");
  };

  const handleCare = () => {
    scrollToSection("care");
  };

  const handleAbout = () => {
    scrollToSection("about");
  };

  const handleMyPlants = () => {
    navigate("/my-plants");
  };

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        onClick={handleHome}
      >
        <span className="logo-icon">🌱</span>

        <span>Smart Plant Care</span>
      </Link>

      <div className="nav-links">
        <button
          className="nav-button"
          onClick={handleHome}
        >
          Home
        </button>

        <button
          className="nav-button"
          onClick={handleScanner}
        >
          Plant Scanner
        </button>

        <button
          className="nav-button"
          onClick={handleCare}
        >
          Plant Care
        </button>

        <button
          className="nav-button"
          onClick={handleMyPlants}
        >
          🌿 My Plants
        </button>

        <button
          className="nav-button"
          onClick={handleAbout}
        >
          About
        </button>

        {user && (
          <span className="welcome-user">
            👋 {user.name}
          </span>
        )}

        {user && (
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;