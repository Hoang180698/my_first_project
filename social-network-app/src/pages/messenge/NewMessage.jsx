import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { useCreateConversationMutation } from "../../app/services/chat.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NewMessage() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [term, setTerm] = useState("");
  const [noRes, setNoRes] = useState(false);

  const [searchUser] = useLazySearchUserQuery();
  const [createConversation] = useCreateConversationMutation();

  const navigate = useNavigate();

  const handleCreateConversation = (id) => {
    createConversation({ userId: id })
      .unwrap()
      .then((res) => {
        setShowModal(false);
        setUsers([]);
        setTerm("");
        navigate(`/messenge/inbox/${res.id}`);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
      });
  };

  const handleOffModal = () => {
    setShowModal(false);
    setNoRes(false);
    setTerm("");
    setUsers([]);
  };

  const handleSearch = async () => {
    if (term === "") {
      return;
    } else {
      try {
        let { data } = await searchUser(term);
        if (data.length > 0) {
          setNoRes(false);
        } else {
          setNoRes(true);
        }
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleSearchOther = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <i
        role="button"
        onClick={() => setShowModal(true)}
        className="fa-regular fa-pen-to-square ms-auto"
        style={{ fontSize: "26px" }}
      ></i>
      <Modal centered show={showModal}>
        <div className="modal-content px-2">
          <div className="d-flex border-bottom py-2">
            <h6 className="modal-title mx-auto">New Message</h6>
            <button
              type="button"
              className="btn-close"
              onClick={handleOffModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex align-items-center">
              <b>To:</b>
              <input
                type="text"
                placeholder="Search..."
                className="form-control ms-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => handleSearchOther(e)}
              />
            </div>
          </div>
          <div className="border-top p-3 pt-2 new-message-footer">
            {noRes && (
              <div className="mt-3">
                <h4 className="text-center">No result found.</h4>
              </div>
            )}
            {users.length > 0 &&
              users.map((u) => (
                <div className="d-flex mt-2">
                  <img
                    src={
                      u.avatar
                        ? `http://localhost:8080${u.avatar}`
                        : "../../../public/user.jpg"
                    }
                    className="author-img-search"
                  />
                  <div className="px-2 d-flex flex-column">
                    <span className="name-user-modal mt-2">{u.name}</span>
                  </div>
                  <div className="py-2 ms-auto">
                    <button
                      type="button"
                      className="ms-auto btn btn-secondary"
                      onClick={() => handleCreateConversation(u.id)}
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default NewMessage;
