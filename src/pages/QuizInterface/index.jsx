import "./index.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Apis, baseUrl } from "../../Apis";
import { getWindowWidth } from "../../utils/WindowWidth";
import { CorrectionAnswerApi, SelectedOptionApi } from "./Apis";
import trophy from "../../assets/trophy.png";
import { showToast } from "../../utils/toast";

const QuizInterface = () => {
  const windowwidth = getWindowWidth();
  const location = useLocation();
  const [Questions, setQuestions] = useState([]);
  const QuizId = location?.pathname?.split("/")[2];
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [selecteIndex, setSelectIndex] = useState(0);
  const getAllQuizQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}${location?.pathname}`);
      await axios.patch(Apis.incImpression(QuizId));
      setQuestions(response?.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllQuizQuestions();
  }, []);
  const [timerTime, setTimerTime] = useState(Questions?.[selecteIndex]?.timer);
  const [selectedOption, setSelectedOption] = useState("");
  const [correctlyAnswered, setCorrectlyAnswerd] = useState(0);
  const [quizType, setQuizType] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTime((prev) => {
        if (prev > 0) {
          if (prev === 1) {
            const IsCorrectOption = async () => {
              setSubmit(true);
              await CorrectionAnswerApi({
                id: Questions?.[selecteIndex]?._id,
                selectedOption: "123",
              });
              setSubmit(false);
            };
            IsCorrectOption();
            if (selecteIndex <= Questions?.length - 1) {
              setQuizType(Questions?.[selecteIndex]?.quiz?.type);
              setSelectIndex((prev) => prev + 1);
            }
          }
          return prev - 1;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selecteIndex, Questions?.[selecteIndex]?.timer]);
  useEffect(() => {
    setTimerTime(Questions?.[selecteIndex]?.timer);
  }, [selecteIndex, Questions?.[selecteIndex]?.timer]);

  if (loading) {
    return (
      <div className="interface-container">
        <h1 style={{ color: "white" }}>Loading...</h1>
      </div>
    );
  }
  if (Questions?.length <= 0) {
    return (
      <div className="interface-container">
        <h1 style={{ color: "white" }}>No Quiz Found...</h1>
      </div>
    );
  }

  return (
    <div className="interface-container">
      <div className="interface-box">
        {selecteIndex <= Questions?.length - 1 ? (
          <>
            <div className="interface-head">
              <h2>
                {(selecteIndex + 1)?.toString()?.padStart(2, "0")}/
                {Questions?.length?.toString()?.padStart(2, "0")}
              </h2>
              {timerTime ? (
                <h2 style={{ color: "#D60000" }}>
                  00:{timerTime?.toString()?.padStart(2, "0") || "00"}s
                </h2>
              ) : (
                ""
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "3rem",
              }}
            >
              <h1 style={{ textAlign: "center", fontSize: "1.5rem" }}>
                {Questions?.[selecteIndex]?.question_name}
              </h1>
              <div className="interface-option">
                {Questions?.[selecteIndex]?.options?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item?.text && item?.image && (
                        <div
                          onClick={() => setSelectedOption(item?.option_id)}
                          className="interface-option-text interface-option-imageText"
                          style={{
                            display: "flex",
                            gap: 4,
                            cursor: "pointer",
                            border:
                              selectedOption === item?.option_id
                                ? "2px solid #5076FF"
                                : "none",
                          }}
                        >
                          <p style={{ flex: 1 }}>{item?.text}</p>
                          <img
                            src={item?.image}
                            style={{
                              height: 80,
                              width: windowwidth > 680 ? 80 : 200,
                              borderRadius: 8,
                            }}
                          />
                        </div>
                      )}
                      {item?.image && !item?.text && (
                        <img
                          onClick={() => setSelectedOption(item?.option_id)}
                          src={item?.image}
                          style={{
                            height: 80,
                            width: 200,
                            borderRadius: 8,
                            cursor: "pointer",
                            border:
                              selectedOption === item?.option_id
                                ? "2px solid #5076FF"
                                : "none",
                          }}
                        />
                      )}
                      {item?.text && !item?.image && (
                        <p
                          onClick={() => setSelectedOption(item?.option_id)}
                          style={{
                            cursor: "pointer",
                            border:
                              selectedOption === item?.option_id
                                ? "2px solid #5076FF"
                                : "none",
                          }}
                          className="interface-option-text"
                        >
                          {item?.text}
                        </p>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <button
                className="interface-submit"
                onClick={async () => {
                  if (!selectedOption) {
                    return showToast("error", "Please select option");
                  }
                  if (selecteIndex <= Questions?.length - 1) {
                    setSubmit(true);
                    if (Questions?.[selecteIndex]?.quiz?.type === "Q & A") {
                      const response = await CorrectionAnswerApi({
                        id: Questions?.[selecteIndex]?._id,
                        selectedOption,
                      });
                      if (response === "success") {
                        setCorrectlyAnswerd((prev) => prev + 1);
                      }
                    }
                    if (Questions?.[selecteIndex]?.quiz?.type === "Poll Type") {
                      await SelectedOptionApi({
                        id: Questions?.[selecteIndex]?._id,
                        selectedOption,
                      });
                    }
                    setSubmit(false);
                    await setSelectIndex((prev) => prev + 1);
                    await setQuizType(Questions?.[selecteIndex]?.quiz?.type);
                    await setSelectedOption("");
                  }
                }}
              >
                {submit
                  ? "Submitting..."
                  : selecteIndex === Questions?.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {quizType === "Q & A" && (
              <>
                <h2>Congrats Quiz is completed</h2>
                <img src={trophy} />
                <h2>
                  Your Score is{" "}
                  <span style={{ color: "green" }}>
                    {correctlyAnswered?.toString()?.padStart(2, "0") || "00"}/
                    {Questions?.length?.toString()?.padStart(2, "0")}
                  </span>
                </h2>
              </>
            )}
            {quizType === "Poll Type" && (
              <h1 style={{ textAlign: "center", padding: "8rem 0" }}>
                Thank you
                <br /> for participating in <br />
                the Poll
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
