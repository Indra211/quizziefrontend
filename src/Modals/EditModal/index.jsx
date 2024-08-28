import React, { useEffect, useState } from "react";
import { Modal } from "../../components";
import axios from "axios";
import { retriveData } from "../../utils/storages";
import { Apis } from "../../Apis";
import { showToast } from "../../utils/toast";

export const EditModal = ({ open, setOpen, id, setId, metaData }) => {
  const token = retriveData("token");
  const [idx, setIndex] = useState(0);
  const [selectQuizType, setSelectedQuizType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errTxt, setErrTxt] = useState("");
  const [questions, setQuestions] = useState([
    {
      question_name: "",
      type: "Text",
      options: [],
      timer: 0,
      correctOption: "",
    },
  ]);
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(Apis.getQuizQuestions(id), {
        headers: { Authorization: token },
      });

      setQuestions(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const handleItemsChange = (data, index, event, key) => {
    const updatedItems = [...data];
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: event.target.value,
    };
    return updatedItems;
  };

  const handleQuestionName = (index, event) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index] = {
      ...updatedQuestion[index],
      question_name: event.target.value,
    };
    setQuestions(updatedQuestion);
  };
  const handleTextChange = (index, optIndex, key, event) => {
    setQuestions((prev) => {
      const UpdateQuestions = [...prev];
      UpdateQuestions[index] = {
        ...UpdateQuestions[index],
        options: handleItemsChange(
          UpdateQuestions[index]["options"],
          optIndex,
          event,
          key
        ),
      };
      return UpdateQuestions;
    });
  };

  const handleTimer = (index, value) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index] = {
      ...updatedQuestion[index],
      timer: value,
    };
    setQuestions(updatedQuestion);
  };

  useEffect(() => {
    setSelectedQuizType(questions?.[idx]?.type);
  }, [idx, id, questions]);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkQuestionName = questions?.some(
      (item) => item?.question_name === ""
    );
    if (checkQuestionName) {
      return setErrTxt("Please enter Question Name");
    }
    const chkOptionsText = questions?.some((item) =>
      item?.options?.some((ele) => ele?.text === "")
    );

    const chkOptionsImage = questions?.some((item) =>
      item?.options?.some((ele) => ele?.image === "")
    );

    const chkOptionsTextImage = questions?.some((item) =>
      item?.options?.some((ele) => ele?.image === "" || ele?.text === "")
    );

    if (selectQuizType === "Text" && chkOptionsText) {
      return setErrTxt("Please enter options text for all options.");
    } else if (selectQuizType === "Image URL" && chkOptionsImage) {
      return setErrTxt("Please enter image URL for all options.");
    } else if (selectQuizType === "Text & Image URL" && chkOptionsTextImage) {
      return setErrTxt("Please enter both text and image URL for all options.");
    }

    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch(
        Apis.updateQuiz,
        { questions },
        { headers: { Authorization: token } }
      );
      if (response?.data?.success) {
        showToast("success", response?.data?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setId("");
      handleClose();
    }
  };
  return (
    <Modal open={open} onClose={setOpen}>
      <form className="quiz-questions-containers" onSubmit={handleSubmit}>
        <div className="quiz-question-gap">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginLeft: "2rem",
              }}
            >
              {questions?.map((_, index) => {
                return (
                  <div
                    key={index}
                    className="quiz-question-number"
                    style={{
                      border: idx === index ? "2px solid #5076FF" : "none",
                    }}
                    onClick={() => setIndex(index)}
                  >
                    <p>{index + 1}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              marginLeft: "2rem",
            }}
          >
            <input
              className="quiz-question-input"
              value={questions?.[idx]?.question_name}
              placeholder="Enter Question Name"
              onChange={(e) => handleQuestionName(idx, e)}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginLeft: "2rem",
            }}
          >
            <label>Option Type</label>
            {["Text", "Image URL", "Text & Image URL"].map((val, valIndex) => (
              <label key={valIndex} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="radio"
                  value={val}
                  checked={questions?.[idx]?.type === val}
                  disabled={true}
                  style={{ accentColor: "black" }}
                />
                {val}
              </label>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            {questions?.[idx]?.options.map((ele, eleIndex) => (
              <div
                key={ele.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {metaData?.type === "Q & A" ? (
                  <input
                    type="radio"
                    name="options"
                    value={ele.option_id}
                    checked={questions?.[idx]?.correctOption === ele.option_id}
                    disabled={true}
                    style={{
                      marginRight: "10px",
                      accentColor: "#60B84B",
                    }}
                  />
                ) : (
                  <div style={{ marginRight: "24px" }}></div>
                )}
                <input
                  type="text"
                  value={selectQuizType === "Image URL" ? ele.image : ele.text}
                  onChange={(e) => {
                    if (
                      selectQuizType === "Text" ||
                      selectQuizType === "Text & Image URL"
                    ) {
                      handleTextChange(idx, eleIndex, "text", e);
                    } else if (selectQuizType === "Image URL") {
                      handleTextChange(idx, eleIndex, "image", e);
                    }
                  }}
                  style={{
                    marginLeft: "0.5rem",
                    background:
                      questions?.[idx]?.correctOption === ele.option_id
                        ? "#60B84B"
                        : "",
                    color:
                      questions?.[idx]?.correctOption === ele.option_id
                        ? "white"
                        : "",
                  }}
                  placeholder={
                    selectQuizType === "Image URL" ? "Image URL" : "Text"
                  }
                  className="quiz-question-input quiz-question-input-option"
                />
                {selectQuizType === "Text & Image URL" && (
                  <input
                    type="text"
                    value={ele.image}
                    onChange={(e) =>
                      handleTextChange(idx, eleIndex, "image", e)
                    }
                    style={{
                      marginLeft: "0.5rem",
                      background:
                        questions?.[idx]?.correctOption === ele.option_id
                          ? "#60B84B"
                          : "",
                      color:
                        questions?.[idx]?.correctOption === ele.option_id
                          ? "white"
                          : "",
                      width: "35%",
                    }}
                    placeholder="Image URL"
                    className="quiz-question-input quiz-question-input-option"
                  />
                )}
              </div>
            ))}
            {metaData?.type === "Q & A" && (
              <div className="quiz-timer-container">
                <p className="timer-head">Timer</p>
                {[0, 5, 10]?.map((time, timIndex) => {
                  const isSelected = questions[idx]["timer"] === time;
                  return (
                    <p
                      className="timer-options"
                      style={{
                        boxShadow: !isSelected
                          ? "0px 0px 15px 0px #00000026"
                          : "",
                        background: isSelected ? "#D60000" : "",
                        color: isSelected ? "white" : "",
                      }}
                      key={timIndex}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTimer(idx, time);
                      }}
                    >
                      {time ? `${time} sec` : "OFF"}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {errTxt && <p style={{ color: "red" }}>{errTxt}</p>}
        <div className="quiz-btn-container" style={{ marginLeft: "2rem" }}>
          <button className="quiz-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="quiz-btn-submit" type="submit">
            {loading ? "Submitting..." : "Update Quiz"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
