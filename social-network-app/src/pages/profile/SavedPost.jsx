import React from 'react'
import Post from '../../components/post/Post'
import { useState } from 'react'
import { useDeletePostMutation, useGetAllSavedPostQuery, useLazyGetAllSavedPostQuery, useLikePostMutation, useSavePostMutation, useUnSavePostMutation, useUnlikePostMutation } from '../../app/services/posts.service';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useEffect } from 'react';
import PostList from '../../components/post/PostList';

function SavedPost() {
  // const { data, isLoading } = useGetAllSavedPostQuery();
  const [deletePost] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [savePost] = useSavePostMutation();
  const [unsavePost] = useUnSavePostMutation();
  const [currentPageSize, setCurrentPageSize] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);
  const [getPosts] = useLazyGetAllSavedPostQuery();
  const [posts, setPosts] = useState([]);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLast && !loading) {
      setCurrentPageSize(currentPageSize + 8);
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
    if (currentPageSize > 0 && !isLast) {
      setLoading(true);
      getPosts({ page: 0, pageSize: currentPageSize })
        .unwrap()
        .then((data) => {
          // const filterData = data.content.filter((x) => {
          //   return !posts.some((existingItem) => existingItem.post.id === x.post.id);
          // });
          setPosts(data.content);
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
  }, [currentPageSize]);

  useEffect(() => {
    const fectchData = async () => {
      setLoading(true);
      try {
        const { data } = await getPosts({
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
      setCurrentPageSize(0);
      setIsLast(false);
    };
  }, []);


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

  if (posts.length === 0 && isLast) {
    return (
      <section className="main-content">
        <div className="container">
          <div className="row">
            <h1>
              <h1 className="text-center">No have post</h1>
              <p className="text-center">When you share photos, they will appear on your profile.</p>
            </h1>
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
           <div className="main-content">
           <h3 style={{fontWeight:"bold"}} className="text-center text-uppercase">Saved Post</h3>
        <div className="d-flex justify-content-center">
         
          <br />
          <div className="row" style={{width:"1050px"}}>
          {posts.length > 0 &&
               posts.map((p) => <PostList key={p.post.id} post={p} likePost={handleLikePost} savePost={handeleSavePost} deletePost={handleDeletePost}/>)}
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
  )
}

export default SavedPost