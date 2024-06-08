import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeletePostMutation, useLazyGetPostByListIdQuery, useLazyGetPostsQuery, useLikePostMutation, useSavePostMutation, useUnSavePostMutation, useUnlikePostMutation } from "../../app/services/posts.service";
import useCreatePost from "../newPost/useCreatePost";
import "./sass/style.scss";
// import ImageSlider from "../../components/imageSlider/ImageSlider";
// import { formatDate } from "../../utils/functionUtils";
import Post from "../../components/post/Post";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { baseUrl, userImage } from "../../App";

function HomePage() {
  const { auth } = useSelector((state) => state.auth);
  const { postIds } = useSelector((state) => state.newpost);
  const { onCreatePost } = useCreatePost();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const pageRef = useRef(null);
  const [deletePost] = useDeletePostMutation();
  const [conect, setConect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [posts, setPosts] = useState([]);
  const [getPosts] = useLazyGetPostsQuery();
  const [getNewPosts] = useLazyGetPostByListIdQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const loadMoreRef = useRef(null);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [savePost] = useSavePostMutation();
  const [unsavePost] = useUnSavePostMutation();

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
    if(postIds.length > 0 && conect) {
      let ids = postIds.join();
      getNewPosts(ids).unwrap()
      .then((data) => {
        const filterData = data.filter((x) => {
          return !posts.some(
            (existingItem) => existingItem.post.id === x.post.id
          );
        });
        setPosts([ ...filterData, ...posts ]);
        scrollTo();
      }).catch((err) => {
        console.log(err);
      });
    }
  },[postIds, conect])

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
      getPosts({ page: currentPage, pageSize: 5 })
        .unwrap()
        .then((data) => {
          const filterData = data.content.filter((x) => {
            return !posts.some(
              (existingItem) => existingItem.post.id === x.post.id
            );
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
          page: 0,
          pageSize: 5,
        });
        const filterData = data.content.filter((x) => {
          return !posts.some(
            (existingItem) => existingItem.post.id === x.post.id
          );
        });
        setPosts([ ...posts, ...filterData ]);
      } catch (error) {
        console.log(error);
        toast.error("Error on page load.");
      } finally {
        setLoading(false);
        setConect(true);
      }
    };
    
    fectchData();

    return () => {
      setCurrentPage(0);
      setIsLast(false);
      setConect(false);
    };
  }, []);

  const scrollTo = () => {
    pageRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (pageRef.current) {
      if (pageRef.current.scrollTop > 4000) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
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

  const handleDeletePost = (id) => {
    deletePost(id)
      .unwrap()
      .then(() =>{
        toast.success("You delete the post!");
        setPosts(pre => pre.filter((p) => p.post.id !== id));
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
      });
};


  return (
    <>
      <Helmet>
        <title>Hoagram</title>
      </Helmet>
      <div className="position-relative">
        {showScrollButton && (
          <span className="scroll-button-home-page" onClick={scrollTo}>
            <i className="fa-solid fa-circle-chevron-up"></i>
          </span>
        )}
        <div
          className="container main-content"
          ref={pageRef}
          onScroll={handleScroll}
        >
          <div className="col-sm-6 offset-sm-3">
            <div className="post-block">
              <div className="form-body ms-5">
                <Link className="homepage-avatar" to={"/profile/"}>
                  {" "}
                  <img
                    src={
                      auth.avatar
                        ? `${baseUrl}${auth.avatar}`
                        : `${userImage}`
                    }
                    alt=""
                  />
                </Link>

                <div
                  className="form-submit"
                  onClick={onCreatePost}
                  role="button"
                >
                  What's on your mind, {auth.name}?
                </div>
              </div>
              <hr />
              <div className="icon-homepage">
                <span>🙈 🖤 💛 💙 💜 💚 💖 🧡 🙉</span>
              </div>
            </div>
          </div>
          {/* Post  */}

          <div className="row">
            {posts.length > 0 &&
              posts.map((p, index) => (
                <div key={index}>
                  <Post p={p} likePost={handleLikePost} savePost={handeleSavePost} deletePost={handleDeletePost}/>
                  {index === posts.length - 2 &&  <span ref={loadMoreRef}></span>}
                </div>
              ))}
            ;{/* ***************** */}
            {loading && (
              <div className="container">
                <div className="text-center m-2">
                  <div className="spinner-border m-2" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            )}
            {isLast && (
              <div className="col-sm-6 offset-sm-3">
                <div className="post-block text-center">
                  <h2>You're all caught up</h2>
                  <Link to={"./search"} className="btn btn-primary">
                    find more friends
                  </Link>
                  <div className="d-flex justify-content-between"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
