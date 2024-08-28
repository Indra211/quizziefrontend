import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./index.css";
import { RemoveData } from "../../utils/storages";
import { showToast } from "../../utils/toast";

export const SideMenu = ({ setCreateModalOpen }) => {
  const navigate = useNavigate();
  return (
    <div className="home-sidemenu">
      <h2 className="home-sidemenu-head">QUIZZIE</h2>
      <div className="home-sidemenu-options">
        {["Dashboard", "Analytics"]?.map((item, index) => {
          const routes = {
            Dashboard: "/",
            Analytics: "/analytics",
          };
          return (
            <NavLink
              to={routes[item]}
              key={index}
              className={({ isActive }) =>
                `home-sidemenu-option ${
                  isActive ? "home-sidemenu-option-selected" : ""
                }`
              }
            >
              <button className="home-sidemenu-item">{item}</button>
            </NavLink>
          );
        })}
        <div className="home-sidemenu-option">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="home-sidemenu-item"
          >
            Create QUiz
          </button>
        </div>
      </div>
      <h2
        className="home-sidemenu-logout"
        onClick={() => {
          RemoveData("token");
          navigate("/register");
          showToast("success", "successfully logout");
        }}
      >
        Logout
      </h2>
    </div>
  );
};
