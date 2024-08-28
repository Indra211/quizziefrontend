import React, { useEffect, useState } from "react";
import "./index.css";
import { Apis } from "../../Apis";
import { retriveData } from "../../utils/storages";
import axios from "axios";
import { Table } from "./Table";
import { useDispatch, useSelector } from "react-redux";
import { setQuizs } from "../../redux/features";

const Analytics = () => {
  const token = retriveData("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { quizs, quizUpdates } = useSelector((state) => state?.quiz);
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(Apis.getAllQuizzes, {
        headers: { Authorization: token },
      });
      dispatch(setQuizs(response.data || []));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuizzes();
  }, [quizUpdates]);
  return (
    <div className="analytics-container">
      <h1 className="analytics-head">Quiz Analysis</h1>
      {loading && quizs?.length <= 0 ? (
        <p className="no-data-text"> Loading...</p>
      ) : quizs?.length > 0 ? (
        <Table quizzes={quizs} />
      ) : (
        <p className="no-data-text"> No Quiz Created...</p>
      )}
    </div>
  );
};

export default Analytics;
