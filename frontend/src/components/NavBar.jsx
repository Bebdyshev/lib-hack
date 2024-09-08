import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const gender = localStorage.getItem("gender") ? "male" : "female";
  const username = localStorage.getItem("name") || "aziz";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">BookShelf</NavLink>
      </div>
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? 'active' : '')} 
            end
          >
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/findbook" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span>FindBook</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="http://127.0.0.1:5000/index" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span>Services</span>
          </NavLink>
        </li>
        <li>
          <div className="navbar-avatar" onClick={toggleDropdown}>
            <img 
              src={`https://avatar.iran.liara.run/public/${gender ? "boy" : "girl"}?username=${username}`} 
              alt="User Avatar" 
            />
            {isDropdownOpen && (
              <div className="navbar-dropdown">
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/matches">Matches</NavLink>
                <NavLink to="/reservations">Reservations</NavLink>
                <NavLink to="/logout">Logout</NavLink>
              </div>
            )}
          </div>
        </li>
      </ul>
      <div className="navbar-toggle" onClick={toggleMenu} style={{zIndex: "1010"}}>
        <span className="navbar-toggle-icon"></span>
        <span className="navbar-toggle-icon"></span>
        <span className="navbar-toggle-icon"></span>
      </div>
    </nav>
  );
};

export default Navbar;
