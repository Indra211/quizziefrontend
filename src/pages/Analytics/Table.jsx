import React, { useState } from "react";
import "./index.css";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import { showToast } from "../../utils/toast";
import { DeleteModal, EditModal } from "../../Modals";
import { handleImpressionCount } from "../../utils/helpers";

export const Table = React.memo(({ quizzes }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [id, setId] = useState("");
  const [meta_data, setMeta_Data] = useState();
  const handleOpenAndId = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleEditOpenAndId = (item) => {
    setId(item?._id);
    setEditOpen(true);
    setMeta_Data(item);
  };
  return (
    <table className="analytics-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Quiz Name</th>
          <th>Created on</th>
          <th>Impression</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {quizzes?.map((item, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.name}</td>
              <td>{dayjs(item?.createdAt).format("DD MMM, YYYY")}</td>
              <td>{handleImpressionCount(item?.impressions)}</td>
              <td className="analytics-table-icons">
                <p
                  style={{ cursor: "pointer", color: "#854CFF" }}
                  onClick={() => handleEditOpenAndId(item)}
                >
                  <BiEdit />
                </p>
                <p
                  style={{ cursor: "pointer", color: "#D60000" }}
                  onClick={() => handleOpenAndId(item?._id)}
                >
                  <RiDeleteBin6Fill />
                </p>
                <p
                  style={{ cursor: "pointer", color: "#60B84B" }}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${window.location.origin}/quiz/${item?._id}`
                      );
                      showToast("success", "Link copied to Clipboard");
                    } catch (err) {
                      console.error("Failed to copy text: ", err);
                    }
                  }}
                >
                  <IoMdShare />
                </p>
              </td>
              <td>
                <p
                  onClick={() =>
                    navigate(`/getQuizQuestion/${item?._id}`, { state: item })
                  }
                  className={"navlink"}
                >
                  Question Wise Analysis
                </p>
              </td>
              <td></td>
            </tr>
          );
        })}
        {open && id && (
          <DeleteModal open={open} setOpen={setOpen} id={id} setId={setId} />
        )}
        {editOpen && id && meta_data && (
          <EditModal
            open={editOpen}
            setOpen={setEditOpen}
            id={id}
            setId={setId}
            metaData={meta_data}
          />
        )}
      </tbody>
    </table>
  );
});
