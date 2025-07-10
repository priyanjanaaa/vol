

import { Link } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const VolunteerNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top w-100">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          HELPER
        </Link>

        {/* Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/VolunteerDashboard">YOUR TASKS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/VolunteerAvailable">AVAILABLE TASKS</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default VolunteerNav;
