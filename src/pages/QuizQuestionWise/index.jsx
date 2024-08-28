import axios from "axios";
import "./index.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../../Apis";
import { retriveData } from "../../utils/storages";
import { handleImpressionCount } from "../../utils/helpers";
import dayjs from "dayjs";

export const QuestionWiseDetail = () => {
  const location = useLocation();
  const quizData = location?.state;
  const token = retriveData("token");
  const [loading, setLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const fetchQuestionsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}${location.pathname}`, {
        headers: {
          Authorization: token,
        },
      });
      setQuestionsData(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestionsData();
  }, []);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="question-box-container padding-container">
      <div className="question-head-container">
        <h1 style={{ color: "#5076FF" }}>{quizData?.name}</h1>
        <div>
          <h6 style={{ color: "#FF5D01" }}>
            Created on : {dayjs(quizData?.createdAt).format("DD MMM, YYYY")}
          </h6>
          <h6 style={{ color: "#FF5D01" }}>
            impressions : {handleImpressionCount(quizData?.impressions)}
          </h6>
        </div>
      </div>
      <div className="question-box-container">
        {questionsData?.map((item, index) => {
          return (
            <div className="question-container">
              <p style={{ fontWeight: "600", fontSize: "1.5rem" }}>
                Q.{index + 1} {item?.question_name}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {quizData?.type === "Q & A" && (
                  <>
                    <div className="question-count-box">
                      <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                        {handleImpressionCount(
                          item?.correctlyAnswered + item?.incorrectlyAnswered
                        )}
                      </p>
                      <h6>People Attempted the question</h6>
                    </div>
                    <div className="question-count-box">
                      <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                        {handleImpressionCount(item?.correctlyAnswered)}
                      </p>
                      <h6>People Answered Correctly</h6>
                    </div>
                    <div className="question-count-box">
                      <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                        {handleImpressionCount(item?.incorrectlyAnswered)}
                      </p>
                      <h6>People Answered Incorrectly</h6>
                    </div>
                  </>
                )}
                {quizData?.type === "Poll Type" &&
                  item?.options?.map((opt, optIndex) => {
                    return (
                      <div
                        key={optIndex}
                        className="question-count-box question-count-poll-type-box"
                      >
                        <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                          {handleImpressionCount(opt?.selection_count)}
                        </p>
                        <h6>option {optIndex + 1}</h6>
                      </div>
                    );
                  })}
              </div>
              <p style={{ height: "0px", border: "1px solid #D7D7D7" }}></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
