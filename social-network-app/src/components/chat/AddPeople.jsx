import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { useSelector } from "react-redux";
import { baseUrl, userImage } from "../../App";

var pageSize = 7;
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

  const [key, setKey] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLast && !loading) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, options]);

  useEffect(() => {
    if (currentPage > 0 && !isLast && key) {
      setLoading(true);
      searchUser({ term: key, page: currentPage, pageSize: pageSize })
        .unwrap()
        .then((data) => {
          const filterData = data.content.filter((x) => {
            return !users.some((existingItem) => existingItem.id === x.id)
             && !oldUserIds.some(oldId => oldId === x.id);
          });
          setUsers((pre) => [...pre, ...filterData]);
          setIsLast(data.last);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error on page load.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentPage]);

  useEffect(() => {
    const fectData = async () => {
      if (key) {
        try {
          let { data } = await searchUser({ term: key, page: 0, pageSize: pageSize });
          const filterData = data.content.filter((x) => {
            return !oldUserIds.some(oldId => oldId === x.id);
          });
          setUsers(filterData);
          setIsLast(data.last);
          if(data.content?.length === 0 && data.last) {
            setNoRes(true);
          } else {
            setNoRes(false);
          }
        } catch (error) {
          console.log(error);
          navigate("/search");
          toast.error("Check your network.")
        }
      }
    };
    fectData();

    return () => {
      setCurrentPage(0);
      setTerm("");
      setKey("");
    };
  }, [key]);

  const handleSearch = async () => {
    if (term) {
      setKey(term);
    }
  };
  const handleSearchOther = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
                  <div className="position-relative">
                  <img
                    src={
                      u.avatar
                        ? `${baseUrl}${u.avatar}`
                        : `${userImage}`
                    }
                    className="author-img-search"
                  />
                  {u.online && <span className="conversation-active" style={{right:"5%", bottom:"5%"}}></span>}   
                  </div>
                
                  <div className="px-2 d-flex flex-column">
                    <span className="name-user-modal mt-2">{u.name}</span>
                  </div>
                  <div className="py-2 ms-auto">
                    <input
                      type="checkbox"
                      className="checked-add-user-chat"
                      checked={
                        selectedUsers.some((x) => x.id === u.id)
                      }
                      onChange={() => handleAddUsers(u)}
                    ></input>
                  </div>
                </div>
              ))}
               <span className="mb-2" ref={loadMoreRef}></span>
               {loading && (
            <div className="container">
              <div className="text-center m-3">
                <div className="spinner-border m-3" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )}
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
