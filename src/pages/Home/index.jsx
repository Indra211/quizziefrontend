import "./index.css";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { retriveData } from "../../utils/storages";
import { CreateQuizModal } from "../../Modals";
import { SideMenu } from "./SideMenu";

const Home = () => {
  const navigate = useNavigate();
  const token = retriveData("token");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate]);
  return (
    <div className="home-container">
      <SideMenu setCreateModalOpen={setCreateModalOpen} />
      <div className="home-content">
        <Outlet />
      </div>
      {createModalOpen && (
        <CreateQuizModal open={createModalOpen} onClose={setCreateModalOpen} />
      )}
    </div>
  );
};

export default Home;
