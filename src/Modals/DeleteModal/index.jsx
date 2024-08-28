import React from "react";
import axios from "axios";
import "./index.css";
import { Apis } from "../../Apis";
import { retriveData } from "../../utils/storages";
import { Modal } from "../../components";
import { showToast } from "../../utils/toast";
import { setQuizs } from "../../redux/features";
import { useDispatch, useSelector } from "react-redux";

const DeleteModal = ({ open, setOpen, id, setId }) => {
  const token = retriveData("token");
  const { quizs } = useSelector((state) => state?.quiz);
  const dispatch = useDispatch();
  const updateQuiz = () => {
    return quizs?.filter((ele) => ele?._id !== id);
  };
  const deleteQuiz = async () => {
    try {
      const response = await axios.delete(Apis.deleteQuiz(id), {
        headers: {
          Authorization: token,
        },
      });
      showToast("success", response?.data);
      dispatch(setQuizs(updateQuiz()));
      setOpen(false);
      setId("");
    } catch (error) {
      showToast("success", "something went wrong");
    }
  };
  return (
    <Modal open={open} onClose={setOpen}>
      <div className="delete-modal-container">
        <div>
          <h1 style={{ textAlign: "center", color: "#474444" }}>
            Are you confirm you
          </h1>
          <h1 style={{ textAlign: "center", color: "#474444" }}>
            want to delete ?
          </h1>
        </div>
        <div className="delete-btn-container">
          <button className="delete-btn-submit" onClick={deleteQuiz}>
            Confirm Delete
          </button>
          <button className="delete-btn-cancel" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
