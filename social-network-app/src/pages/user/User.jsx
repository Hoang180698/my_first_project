import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFollowhUserMutation,
  useGetUserByIdQuery,
  useUnfollowhUserMutation,
} from "../../app/services/user.service";
import {
  useLazyGetPostByUserIdQuery, useLikePostMutation, useSavePostMutation, useUnSavePostMutation, useUnlikePostMutation,
} from "../../app/services/posts.service";
import { useSelector } from "react-redux";
import { post } from "jquery";
import { Modal } from "react-bootstrap";
import Follower from "../../components/users/Follower";
import Following from "../../components/users/Following";
import { toast } from "react-toastify";
import { useCreateConversationMutation } from "../../app/services/chat.service";
import PostList from "../../components/post/PostList";
import { useEffect } from "react";
import { baseUrl, userImage } from "../../App";

function User() {
  const { userId } = useParams();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdQuery(userId);
  const [getPosts] = useLazyGetPostByUserIdQuery();

  const { auth } = useSelector((state) => state.auth);
  const [followUser] = useFollowhUserMutation();
  const [unfollowUser] = useUnfollowhUserMutation();
  const [createConversation] = useCreateConversationMutation();
  const [posts, setPosts] = useState([]);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [savePost] = useSavePostMutation();
  const [unsavePost] = useUnSavePostMutation();

  const [showModal, setShoModal] = useState(false);

  const [showFollower, setShowFollower] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const navigate = useNavigate();
  
  if (auth.id === Number(userId)) {
    navigate("/profile/");
  }

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
    if (currentPage > 0 && !isLast) {
      setLoading(true);
      getPosts({ userId: userId, page: currentPage, pageSize: 8 })
        .unwrap()
        .then((data) => {
          const filterData = data.content.filter((x) => {
            return !posts.some((existingItem) => existingItem.post.id === x.post.id);
          });
          setPosts((pre) => [...pre, ...filterData]);
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
    const fectchData = async () => {
      setLoading(true);
      try {
        const { data } = await getPosts({
          userId: userId,
          page: 0,
          pageSize: 8,
        });
        setPosts(data.content);
      } catch (error) {
        console.log(error);
        toast.error("Error on page load.");
      } finally {
        setLoading(false);
      }
    };
    fectchData();

    return () => {
      setPosts([]);
      setCurrentPage(0);
      setIsLast(false);
      setLoading(false);
    };
  }, [userId]);

  const handleCreateConversation = (id) => {
    createConversation({ userId: id })
      .unwrap()
      .then((res) => {
        navigate(`/messenge/inbox/${res.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFollow = (id) => {
    setLoadingButton(true);
    followUser(id)
      .unwrap()
      .then(() => {
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      });
  };

  const handleUnfollow = (id) => {
    setLoadingButton(true);
    unfollowUser(id)
      .unwrap()
      .then(() => {
        setShoModal(false);
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
        setShoModal(false);
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      });
  };

  const handleLikePost = (postId, liked) => {
    if (liked) {
      unlikePost(postId)
        .unwrap()
        .then((res) => {
            const newPosts = posts.map((p) => {
              if(p.post.id === postId) {
                const nPost = { ...p.post, likeCount: res.likeCount};
                return { ...p, liked: false, post: nPost};
              }
              return p;
            });
            setPosts(newPosts);
        })
        .catch((err) =>{
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      likePost(postId)
        .unwrap()
        .then((res) => {
          const newPosts = posts.map((p) => {
            if(p.post.id === postId) {
              const nPost = { ...p.post, likeCount: res.likeCount};
              return { ...p, liked: true, post: nPost};
            }
            return p;
          });
          setPosts(newPosts);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  }

  const handeleSavePost = (saved, postId) => {
    if(saved) {
      unsavePost(postId).unwrap()
        .then(() => {
          const newPosts = posts.map((p) => {
            if(p.post.id === postId) {
              return { ...p, saved: false};
            }
            return p;
          });
          setPosts(newPosts);
        })
        .catch((err) =>{
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      savePost(postId).unwrap()
        .then(() => {
          const newPosts = posts.map((p) => {
            if(p.post.id === postId) {
              return { ...p, saved: true};
            }
            return p;
          });
          setPosts(newPosts);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="container">
        <div className="text-center m-5">
          <div className="spinner-border m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  if (!user && !isLoadingUser) {
    return (
      <div className="container">
        <h3 className="text-center mt-5">Sorry, this page isn't available.</h3>
        <p className="text-center mt-4">
          The link you followed may be broken, or the page may have been
          removed. Go back to Hoagram.
        </p>
      </div>
    );
  }
  return (
    <>
      {showFollower && (
        <Modal centered show={showFollower} dialogClassName="modal-width">
          <div className="modal-content px-2">
            <div className="d-flex border-bottom py-2">
              <h6 className="modal-title mx-auto">Followers</h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowFollower(false)}
              ></button>
            </div>
            <Follower userId={user.id} />
          </div>
        </Modal>
      )}
      {showFollowing && (
        <Modal centered show={showFollowing} dialogClassName="modal-width">
          <div className="modal-content px-2">
            <div className="d-flex border-bottom py-2">
              <h6 className="modal-title mx-auto">Following</h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowFollowing(false)}
              ></button>
            </div>
            <Following userId={user.id} />
          </div>
        </Modal>
      )}
      {user.followed && (
        <Modal centered show={showModal} size="sm">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-center flex-column">
              <div className="author-modal">
                <img
                  src={
                    user.avatar
                      ? `${baseUrl}${user.avatar}`
                      : `${userImage}`
                  }
                  alt="User"
                  className="author-img-modal"
                />
              </div>
              <p className="modal-title text-center mt-3 unfollow-question">
                Unfollow {user.name}?
              </p>
            </div>
            <div className="">
              <a
                type="button"
                className="d-block btn avatar-modal text-danger"
                onClick={() => handleUnfollow(user.id)}
              >
                Unfollow
              </a>
            </div>
            <div className="border-top">
              <a
                type="button"
                className="d-block btn"
                onClick={() => setShoModal(false)}
              >
                Cancel
              </a>
            </div>
          </div>
        </Modal>
      )}
      <div className="container d-flex">
        <div className="profile-container">
          <div className="profile d-flex mt-5">
            <div className="profile-image d-flex justify-content-center">
              <img
                src={
                  user.avatar
                    ? `${baseUrl}${user.avatar}`
                    : `${userImage}`
                }
              />
            </div>
            <div className="profile-right d-flex flex-column">
              <div className="profile-user-settings d-flex ms-4 ps-1">
                <h1 className="profile-user-name h4">{user.name}</h1>

                {!user.followed && (
                  <button
                    className="btn ms-4 btn-primary"
                    onClick={() => handleFollow(user.id)}
                    disabled={loadingButton}
                  >
                    {loadingButton && (
                      <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                    )}
                    {!loadingButton && "follow"}
                  </button>
                )}
                {user.followed && (
                  <button
                    className="btn pt-2 ms-4 btn-edit-profile"
                    onClick={() => setShoModal(true)}
                    disabled={loadingButton}
                  >
                    {loadingButton && (
                      <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                    )}
                    {!loadingButton && "following"}
                  </button>
                )}
                <a
                  className="btn pt-2 ms-4 btn-edit-profile"
                  role="button"
                  onClick={() => handleCreateConversation(user.id)}
                >
                  Message
                </a>
              </div>

              <div className="profile-stats">
                <ul className="d-flex mt-4">
                  <li className="me-3">
                    <b>{user.postCount}</b> post
                  </li>
                  <li className="mx-3">
                    {(user.followerCount > 0 && (
                      <a role="button" onClick={() => setShowFollower(true)}>
                        <b>{user.followerCount}</b> followers
                      </a>
                    )) || (
                      <a>
                        <b>{user.followerCount}</b> followers
                      </a>
                    )}
                  </li>
                  <li className="mx-3">
                    {(user.followingCount > 0 && (
                      <a role="button" onClick={() => setShowFollowing(true)}>
                        <b>{user.followingCount}</b> following
                      </a>
                    )) || (
                      <a>
                        <b>{user.followingCount}</b> following
                      </a>
                    )}
                  </li>
                </ul>
              </div>
              <div className="profile-bio ps-5 mt-4">
                <p>{user.biography}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container d-flex mt-4">
        <p className="me-auto ms-auto">
          <i className="fa-solid fa-venus-mars"></i> {user.gender}
        </p>
        <p className="me-auto">
          <i className="fa-solid fa-cake-candles"></i> {user.birthday}
        </p>
        <p className="me-auto">
          <i className="fa fa-phone me-2"></i> {user.phone}
        </p>
        <p className="me-auto">
          <i className="fa fa-map-marker-alt me-2"></i> {user.address}
        </p>
      </div>
      {/* post */}
      <div className="border-top ">
        <div className="main-content">
          <div className="d-flex justify-content-center">
            <br />

            <div className="row" style={{width:"1050px"}}>
              {(posts.length === 0 && isLast) && (
                <div className="d-grid text-center">
                  <span style={{ fontSize: "30px" }}>
                    <i className="fa-solid fa-camera-retro"></i>
                  </span>
                  <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                    No Posts Yet
                  </span>
                </div>
              )}
              {post.length > 0 &&
              posts.map((p) => <PostList key={p.post.id} post={p} likePost={handleLikePost} savePost={handeleSavePost}/>)}
              <span ref={loadMoreRef}></span>
              {loading && (
                <div className="container">
                  <div className="text-center m-2">
                    <div className="spinner-border m-2" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
