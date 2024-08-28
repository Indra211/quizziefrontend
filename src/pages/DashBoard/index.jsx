import "./index.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Apis } from "../../Apis";
import { retriveData } from "../../utils/storages";
import { QuizTrending } from "./QuizTrending";
import { useSelector } from "react-redux";
import { handleImpressionCount } from "../../utils/helpers";

const Dashboard = () => {
  const token = retriveData("token");
  const { quizUpdates } = useSelector((state) => state?.quiz);
  const [quizCount, setQuizCount] = useState([]);
  const [quiestionCount, setQUestionCount] = useState(0);
  const [impression, setImpression] = useState(0);
  const QuizData = async () => {
    try {
      const response = await axios.get(Apis.getQuizData, {
        headers: {
          Authorization: token,
        },
      });
      setQuizCount(response?.data?.quiz);
      setQUestionCount(response?.data?.questions);
      const imps = response?.data?.quiz?.reduce(
        (acc, curr) => acc + curr?.impressions,
        0
      );
      setImpression(imps);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    QuizData();
  }, [quizUpdates]);
  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p className="count-container" style={{ color: "#FF5D01" }}>
          <span className="count-num-text">{quizCount?.length || 0}</span> Quiz
          <span className="count-down-text">Created</span>
        </p>
        <p className="count-container" style={{ color: "#60B84B" }}>
          <span className="count-num-text">
            {handleImpressionCount(quiestionCount)}
          </span>{" "}
          questions
          <span className="count-down-text" style={{ marginLeft: "-3rem" }}>
            Created
          </span>
        </p>
        <p className="count-container" style={{ color: "#5076FF" }}>
          <span className="count-num-text">
            {handleImpressionCount(impression)}
          </span>{" "}
          Total <span className="count-down-text">Impressions</span>
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <h1>Trending Quizs</h1>
        {quizCount?.length > 0 ? (
          <QuizTrending quizCount={quizCount} />
        ) : (
          <h3 style={{ textAlign: "center" }}>No Quiz created...</h3>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
