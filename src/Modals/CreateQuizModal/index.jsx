import "./index.css";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../components/Modal";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { showToast } from "../../utils/toast";
import axios from "axios";
import { Apis } from "../../Apis";
import { retriveData } from "../../utils/storages";

export const CreateQuizModal = ({ open, onClose }) => {
  const token = retriveData("token");
  const [isQuizQuestions, setIsQuizQuestions] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [quizData, setQuizData] = useState({
    name: "",
    type: "Q & A",
  });
  const [quizError, setQuizError] = useState(false);
  const handleClose = () => {
    onClose(!open);
  };
  const handleQuizData = (e) => {
    e.preventDefault();
    if (!quizData.name) {
      return setQuizError(true);
    }
    setIsQuizQuestions(true);
  };

  const [questionNumbers, setQuestionNumbers] = useState([0]);
  const [selectQuizType, setSelectedQuizType] = useState("Text");
  const [questions, setQuestions] = useState([
    {
      question_name: "",
      type: "Text",
      options: [
        { option_id: uuidv4(), text: "", image: "" },
        { option_id: uuidv4(), text: "", image: "" },
      ],
      timer: 0,
      correctOption: "",
    },
  ]);
  const handleItemsChange = (data, index, event, key) => {
    const updatedItems = [...data];
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: event.target.value,
    };
    return updatedItems;
  };
  const [errTxt, setErrTxt] = useState("");
  const handleAddQUestions = () => {
    const checkQuestionName = questions?.some(
      (item) => item?.question_name === ""
    );
    const checkCorrectOption = questions?.some(
      (item) => item?.correctOption === ""
    );
    if (checkQuestionName) {
      return setErrTxt("Please enter Question Name");
    }
    if (quizData?.type === "Q & A" && checkCorrectOption) {
      return setErrTxt("Please select correct option");
    }
    const chkOptionsText = questions?.some((item) =>
      item?.options?.some((ele) => ele?.text === "")
    );

    const chkOptionsImage = questions?.some((item) =>
      item?.options?.some((ele) => ele?.image === "")
    );

    const chkOptionsTextImage = questions?.some((item) =>
      item?.options?.some((ele) => ele?.image === "" && ele?.text === "")
    );

    if (selectQuizType === "Text" && chkOptionsText) {
      return setErrTxt("Please enter options text for all options.");
    } else if (selectQuizType === "Image URL" && chkOptionsImage) {
      return setErrTxt("Please enter image URL for all options.");
    } else if (selectQuizType === "Text & Image URL" && chkOptionsTextImage) {
      return setErrTxt("Please enter both text and image URL for all options.");
    }
    if (questionNumbers.length < 5) {
      setQuestionNumbers([...questionNumbers, 0]);
      const newItem = {
        question_name: "",
        type: questions[0]["type"],
        options: [
          { option_id: uuidv4(), text: "", image: "" },
          { option_id: uuidv4(), text: "", image: "" },
        ],
        timer: 0,
        correctOption: "",
      };
      setQuestions((prev) => [...prev, newItem]);
      setErrTxt("");
    }
  };
  const handleDeleteQuestion = (index) => {
    setQuestionNumbers((prev) => prev?.filter((_, ind) => ind !== index));
    setQuestions((prev) => prev?.filter((_, ind) => ind !== index));
  };

  const handleQuestionName = (index, event) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index] = {
      ...updatedQuestion[index],
      question_name: event.target.value,
    };
    setQuestions(updatedQuestion);
  };

  const handleQuestionType = (index, event) => {
    if (index === 0) {
      const updatedQuestion = [...questions];
      updatedQuestion[index] = {
        ...updatedQuestion[index],
        type: event.target.value,
        options: [
          { option_id: uuidv4(), text: "", image: "" },
          { option_id: uuidv4(), text: "", image: "" },
        ],
      };
      setSelectedQuizType(event.target.value);
      setQuestions(updatedQuestion);
    }
  };
  const handleCorrectOption = (index, event) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index] = {
      ...updatedQuestion[index],
      correctOption: event.target.value,
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
  const handleNewItem = (index) => {
    const addItem = (data) => {
      if (data.length < 5) {
        const newItem = {
          option_id: uuidv4(),
          text: "",
          image: "",
          selected: false,
        };
        return [...data, newItem];
      }
    };
    setQuestions((prev) => {
      const UpdateQuestions = [...prev];
      UpdateQuestions[index] = {
        ...UpdateQuestions[index],
        options: addItem(UpdateQuestions[index]["options"]),
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
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState("");
  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const checkQuestionName = questions?.some(
      (item) => item?.question_name === ""
    );
    const checkCorrectOption = questions?.some(
      (item) => item?.correctOption === ""
    );

    if (checkQuestionName) {
      return setErrTxt("Please enter Question Name");
    }
    if (quizData?.type === "Q & A" && checkCorrectOption) {
      return setErrTxt("Please select correct option");
    }
    const chkOptionsText = questions?.some((item) =>
      item?.options?.some((ele) => ele?.text === "")
    );

    const chkOptionsImage = questions?.some((item) =>
      item?.options?.some((ele) => ele?.image === "")
    );

    const chkOptionsTextImage = questions?.some((item) =>
      item?.options?.some((ele) => ele?.image === "" && ele?.text === "")
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
      const response = await axios.post(
        Apis.createQuiz,
        {
          quiz_data: quizData,
          quiz_questions_data: questions,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response?.data?.success) {
        setShowCloseIcon(true);
        setQuizId(response?.data?.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} showCloseIcon={showCloseIcon}>
      {!isQuizQuestions && !showCloseIcon && (
        <form className="quiz-create-container" onSubmit={handleQuizData}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              className="quiz-title-input"
              placeholder="Quiz name"
              value={quizData.name}
              onChange={(e) =>
                setQuizData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="quiz-type-options">
              <p>Quiz Type</p>
              {["Q & A", "Poll Type"]?.map((item, index) => {
                const isSelected = quizData.type === item;
                return (
                  <React.Fragment key={index}>
                    <p
                      style={{
                        background: isSelected ? "#60b84b" : "",
                        color: isSelected ? "white" : "#9F9F9F",
                        boxShadow: isSelected
                          ? ""
                          : "0px 0px 25px 0px #00000026",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setQuizData((prev) => ({ ...prev, type: item }))
                      }
                    >
                      {item}
                    </p>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {quizError && (
            <p style={{ color: "red", fontSize: 12 }}>Name required</p>
          )}
          <div className="quiz-btn-container">
            <button className="quiz-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button className="quiz-btn-submit" type="submit">
              Continue
            </button>
          </div>
        </form>
      )}
      {isQuizQuestions && !showCloseIcon && (
        <form className="quiz-questions-containers" onSubmit={handleSubmitQuiz}>
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
                {questionNumbers?.map((_, index) => {
                  const isIndex = questionNumbers?.length === index + 1;
                  return (
                    <div key={index} className="quiz-question-number">
                      <p>{index + 1}</p>
                      {isIndex && index > 0 && (
                        <p
                          onClick={() => handleDeleteQuestion(index)}
                          className="quiz-question-close"
                        >
                          <IoClose />
                        </p>
                      )}
                    </div>
                  );
                })}
                {questionNumbers?.length < 5 && (
                  <p className="quiz-question-add" onClick={handleAddQUestions}>
                    +
                  </p>
                )}
              </div>
              <p>Max 5 questions</p>
            </div>
            {questions?.map((item, index) => {
              const isIndex = questions?.length === index + 1;
              return (
                isIndex && (
                  <React.Fragment key={index}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        marginLeft: "2rem",
                      }}
                    >
                      <input
                        className="quiz-question-input"
                        value={item?.question_name}
                        onChange={(e) => handleQuestionName(index, e)}
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
                      {["Text", "Image URL", "Text & Image URL"].map(
                        (val, valIndex) => (
                          <label
                            key={valIndex}
                            style={{ display: "flex", gap: "0.5rem" }}
                          >
                            <input
                              type="radio"
                              value={val}
                              checked={item?.type === val}
                              onChange={(e) => {
                                handleQuestionType(index, e);
                              }}
                              style={{ accentColor: "black" }}
                            />
                            {val}
                          </label>
                        )
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      {item?.options.map((ele, eleIndex) => (
                        <div
                          key={ele.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          {quizData?.type === "Q & A" ? (
                            <input
                              type="radio"
                              name="options"
                              value={ele.option_id}
                              checked={item?.correctOption === ele.option_id}
                              onChange={(e) => handleCorrectOption(index, e)}
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
                            value={
                              selectQuizType === "Image URL"
                                ? ele.image
                                : ele.text
                            }
                            onChange={(e) => {
                              if (
                                selectQuizType === "Text" ||
                                selectQuizType === "Text & Image URL"
                              ) {
                                handleTextChange(index, eleIndex, "text", e);
                              } else if (selectQuizType === "Image URL") {
                                handleTextChange(index, eleIndex, "image", e);
                              }
                            }}
                            style={{
                              marginLeft: "0.5rem",
                              background:
                                item?.correctOption === ele.option_id
                                  ? "#60B84B"
                                  : "",
                              color:
                                item?.correctOption === ele.option_id
                                  ? "white"
                                  : "",
                            }}
                            placeholder={
                              selectQuizType === "Image URL"
                                ? "Image URL"
                                : "Text"
                            }
                            className="quiz-question-input quiz-question-input-option"
                          />
                          {selectQuizType === "Text & Image URL" && (
                            <input
                              type="text"
                              value={ele.image}
                              onChange={(e) =>
                                handleTextChange(index, eleIndex, "image", e)
                              }
                              style={{
                                marginLeft: "0.5rem",
                                background:
                                  item?.correctOption === ele.option_id
                                    ? "#60B84B"
                                    : "",
                                color:
                                  item?.correctOption === ele.option_id
                                    ? "white"
                                    : "",
                                width: "35%",
                              }}
                              placeholder="Image URL"
                              className="quiz-question-input quiz-question-input-option"
                            />
                          )}
                          {eleIndex > 1 && (
                            <span
                              style={{
                                fontSize: "1.2rem",
                                margin: "0.5rem 0 0 1rem",
                                cursor: "pointer",
                                color: "#D60000",
                              }}
                            >
                              <RiDeleteBin6Fill
                                onClick={() => {
                                  const updatedItems = item?.options?.filter(
                                    (_, ele) => ele !== eleIndex
                                  );
                                  setQuestions((prev) => {
                                    const UpdateQuestions = [...prev];
                                    UpdateQuestions[index] = {
                                      ...UpdateQuestions[index],
                                      options: updatedItems,
                                    };
                                    return UpdateQuestions;
                                  });
                                }}
                              />
                            </span>
                          )}
                        </div>
                      ))}
                      {quizData?.type === "Q & A" && (
                        <div className="quiz-timer-container">
                          <p className="timer-head">Timer</p>
                          {[0, 5, 10]?.map((time, timIndex) => {
                            const isSelected =
                              questions[index]["timer"] === time;
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
                                  handleTimer(index, time);
                                }}
                              >
                                {time ? `${time} sec` : "OFF"}
                              </p>
                            );
                          })}
                        </div>
                      )}
                      {item?.options?.length <= 3 && (
                        <button
                          style={{ marginLeft: "2rem" }}
                          className="quiz-btn-cancel quiz-item-add"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNewItem(index);
                          }}
                        >
                          Add Item
                        </button>
                      )}
                    </div>
                  </React.Fragment>
                )
              );
            })}
          </div>
          {errTxt && <p style={{ color: "red" }}>{errTxt}</p>}
          <div className="quiz-btn-container" style={{ marginLeft: "2rem" }}>
            <button className="quiz-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button className="quiz-btn-submit" type="submit">
              {loading ? "Submitting..." : "Create Quiz"}
            </button>
          </div>
        </form>
      )}
      {showCloseIcon && (
        <div className="quiz-success-container">
          <h1 style={{ textAlign: "center", padding: "0 2rem" }}>
            Congrats your Quiz is Published!
          </h1>
          <p
            style={{
              background: "#EDEDED",
              padding: "0.8rem 2rem",
              borderRadius: 8,
              fontWeight: "bolder",
            }}
          >
            your link is here
          </p>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/quiz/${quizId}`
                );
                showToast("success", "Link copied to Clipboard");
              } catch (err) {
                console.error("Failed to copy text: ", err);
              }
            }}
            style={{ alignSelf: "center", padding: "0.8rem 6rem" }}
            className="quiz-btn-submit"
          >
            Share
          </button>
        </div>
      )}
    </Modal>
  );
};
