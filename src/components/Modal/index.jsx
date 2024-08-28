import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { IoClose } from "react-icons/io5";
import { setQuizUpdates } from "../../redux/features";

export const Modal = ({ open, onClose, children, showCloseIcon }) => {
  let { quizUpdates } = useSelector((state) => state.quiz);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setQuizUpdates((quizUpdates += "s")));
    onClose(!open);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  };
  return (
    open && (
      <div className="modalOverlay" onClick={handleClose}>
        <div
          className="modalContent"
          onClick={(e) => {
            e.stopPropagation();
            handleKeyDown();
          }}
        >
          {showCloseIcon && (
            <button className="closeButton" onClick={handleClose}>
              <IoClose />
            </button>
          )}
          {children}
        </div>
      </div>
    )
  );
};
