import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useLazyGetPostsExploreQuery,
  useLikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
  useUnlikePostMutation,
} from "../../app/services/posts.service";
import PostList from "../../components/post/PostList";
import { toast } from "react-toastify";

let pageSize = 7;
function Explore() {
  const { auth } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [savePost] = useSavePostMutation();
  const [unsavePost] = useUnSavePostMutation();
  const [getPosts] = useLazyGetPostsExploreQuery();

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
      getPosts({ page: currentPage, pageSize: pageSize })
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
          pageSize: pageSize,
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
  }, []);

  const handleLikePost = (postId, liked) => {
    if (liked) {
      unlikePost(postId)
        .unwrap()
        .then((res) => {
          const newPosts = posts.map((p) => {
            if (p.post.id === postId) {
              const nPost = { ...p.post, likeCount: res.likeCount };
              return { ...p, liked: false, post: nPost };
            }
            return p;
          });
          setPosts(newPosts);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      likePost(postId)
        .unwrap()
        .then((res) => {
          const newPosts = posts.map((p) => {
            if (p.post.id === postId) {
              const nPost = { ...p.post, likeCount: res.likeCount };
              return { ...p, liked: true, post: nPost };
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

  const handeleSavePost = (saved, postId) => {
    if (saved) {
      unsavePost(postId)
        .unwrap()
        .then(() => {
          const newPosts = posts.map((p) => {
            if (p.post.id === postId) {
              return { ...p, saved: false };
            }
            return p;
          });
          setPosts(newPosts);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      savePost(postId)
        .unwrap()
        .then(() => {
          const newPosts = posts.map((p) => {
            if (p.post.id === postId) {
              return { ...p, saved: true };
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

  const render = (index) => {
    if (index % 14 === 0) {
      const newPosts = posts.slice(index, index + 7);
      return (
        <div className="d-flex mt-1" style={{ maxHeight: "606px" }}>
          <div className="row" style={{ width: "790px" }}>
            {newPosts.map((p, i) => (
              <div className="post-list-box me-1 mt-1" key={i}>
                {i < 6 && (
                  <PostList
                    key={p.post.id}
                    post={p}
                    likePost={handleLikePost}
                    savePost={handeleSavePost}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-1">
            {newPosts[6] && (
              <PostList
                post={newPosts[6]}
                likePost={handleLikePost}
                savePost={handeleSavePost}
                isBigSize={true}
              />
            )}
          </div>
        </div>
      );
    }

    if (index % 14 === 7) {
      const newPosts = posts.slice(index, index + 7);
      return (
        <div className="d-flex mt-1" style={{ maxHeight: "606px" }}>
          <div className="mt-1">
            {newPosts[0] && (
              <PostList
                post={newPosts[0]}
                likePost={handleLikePost}
                savePost={handeleSavePost}
                isBigSize={true}
              />
            )}
          </div>
          <div className="row" style={{ width: "790px" }}>
            {newPosts.map((p, i) => (
              <>
                {i > 0 && (
                  <div className="post-list-box me-1 mt-1">
                    <PostList
                      key={p.post.id}
                      post={p}
                      likePost={handleLikePost}
                      savePost={handeleSavePost}
                    />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="d-grid justify-content-center">
          <div>
            {posts.length > 0 &&
              posts.map((_, index) => {
                return render(index);
              })}
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
    </>
  );
}

export default Explore;
