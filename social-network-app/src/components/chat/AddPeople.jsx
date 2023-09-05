import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { useSelector } from "react-redux";

function AddPeople({ conversation, stompClient }) {
  const { token } = useSelector((state) => state.auth);
  const oldUserIds = conversation.users.map((u) => {
    return u.id;
  });

  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [term, setTerm] = useState("");
  const [noRes, setNoRes] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser] = useLazySearchUserQuery();

  const handleAddUsers = (u) => {
    if (selectedUsers.filter((x) => x.id === u.id).length === 0) {
      setSelectedUsers((oldData) => [...oldData, u]);
    } else {
      setSelectedUsers((oldData) => oldData.filter((x) => x.id !== u.id));
    }
  };

  const handleRemoveUserSelect = (id) => {
    setSelectedUsers((oldData) => oldData.filter((x) => x.id !== id));
  };

  const handleAddPeople = () => {
    const userIds = selectedUsers.map((u) => {
      return u.id;
    });
    setLoadingButton(true);
    stompClient.send(
      "/app/message/add-people/" + conversation.id,
      { Authorization: `Bearer ${token}` },
      JSON.stringify({ userIds })
    );
    setTimeout(() => {
      handleOffModal();
    }, 1500);
  };

  const handleOffModal = () => {
    setShowModal(false);
    setNoRes(false);
    setTerm("");
    setUsers([]);
    setSelectedUsers([]);
    setLoadingButton(false);
  };

  const handleSearch = async () => {
    if (term === "") {
      return;
    } else {
      try {
        let { data } = await searchUser(term);
        const filterData = data.filter((x) => !oldUserIds.includes(x.id));
        if (filterData.length > 0) {
          setNoRes(false);
        } else {
          setNoRes(true);
        }
        setUsers(filterData);
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
      <a
        onClick={() => setShowModal(true)}
        className="dropdown-item"
        role="button"
        style={{ fontWeight: "500" }}
      >
        Add people
      </a>
      <Modal centered show={showModal} onHide={handleOffModal}>
        <div className="modal-content px-2">
          <div className="d-flex border-bottom py-2">
            <h6 className="modal-title mx-auto">Add people</h6>
            <button
              type="button"
              className="btn-close"
              onClick={handleOffModal}
            ></button>
          </div>
          <div className="mt-3">
            <div className="d-flex align-items-center">
              <b>To:</b>
              <div className="form-control ms-2 me-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => handleSearchOther(e)}
                />
              </div>
            </div>
          </div>
          <div className="slected-userchat-box mb-2 mt-1">
            {selectedUsers.length > 0 &&
              selectedUsers.map((slectU, index) => (
                <div
                  className="newmessage-slected-user d-flex ms-3 mt-1"
                  key={index}
                >
                  <span>{slectU.name}</span>
                  <span
                    className="ms-3 me-1"
                    type="button"
                    onClick={() => handleRemoveUserSelect(slectU.id)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </span>
                </div>
              ))}
          </div>
          <div className="border-top p-3 pt-2 new-message-footer">
            {noRes && (
              <div className="mt-3">
                <h4 className="text-center">No result found.</h4>
              </div>
            )}
            {users.length > 0 &&
              users.map((u) => (
                <div className="d-flex mt-2" key={u.id}>
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
                    <input
                      type="checkbox"
                      className="checked-add-user-chat"
                      checked={
                        selectedUsers.filter((x) => x.id === u.id).length > 0
                      }
                      onChange={() => handleAddUsers(u)}
                    ></input>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-3 mb-2 d-grid gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={selectedUsers.length < 1}
              onClick={handleAddPeople}
            >
              {(loadingButton && (
                <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
              )) ||
                "Next"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddPeople;
