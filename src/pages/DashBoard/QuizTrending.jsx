import "./index.css";
import React from "react";
import eye from "../../assets/openeye.png";
import dayjs from "dayjs";
import { handleImpressionCount } from "../../utils/helpers";

export const QuizTrending = React.memo(({ quizCount }) => {
  return (
    <div className="trending-quiz">
      {quizCount?.map((item, index) => {
        return (
          <div key={index} className="trending-quiz-box">
            <div className="trending-quiz-img-text">
              <p className="trending-text">{item?.name}</p>
              <p className="trending-quiz-img">
                {handleImpressionCount(item?.impressions)}
                <img
                  src={eye}
                  style={{
                    height: "1rem",
                  }}
                />
              </p>
            </div>
            <p className="trending-time-text">
              Created on : {dayjs(item?.createdAt).format("DD MMM, YYYY")}
            </p>
          </div>
        );
      })}
    </div>
  );
});
