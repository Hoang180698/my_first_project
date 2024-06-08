import React, { useEffect, useRef, useState } from "react";
import { useLazyGetCommentByIdQuery, useLazyGetCommentByPostIdQuery, useLazyGetOwnCommentsByPostIdQuery, useLazyGetReplyCommentByIdQuery } from "../../app/services/comment.service";
import { toast } from "react-toastify";
import CommentBox from "./CommentBox";
import { useParams } from "react-router-dom";

var pageSize = 10;
function Comments({postId, setCommentCount, newComment}) {
   const { commentId, replyId} = useParams();
   const [getComments] = useLazyGetCommentByPostIdQuery();
   const [getCommentById] = useLazyGetCommentByIdQuery();
   const [getReplyCommentById] = useLazyGetReplyCommentByIdQuery();

   const [comments, setComments] = useState([]);

   const [currentPage, setCurrentPage] = useState(0);
   const [isLast, setIsLast] = useState(false);
   const [loading, setLoading] = useState(false);
   const loadMoreRef = useRef(null);
   const [getOwnCmt] = useLazyGetOwnCommentsByPostIdQuery();
   const [ownComments, setOwnComments] = useState([]);

   const [focusComment, setFocusCommnet] = useState(null);
   const [focusReplyComment, setFocusReplyCommnet] = useState(null);
   const focusCommentRef = useRef();

   const handleDeleteComment = (id) => {
      setOwnComments((pre) => pre.filter(x => x.id !==id));
  };

  useEffect(() => {
    if(focusCommentRef.current) {
      focusCommentRef.current.scrollIntoView({ block: 'center', inline: 'start' });
    }
  },[focusCommentRef.current, commentId]);

  useEffect(() => {
    if(!isNaN(replyId)) {
      getReplyCommentById(replyId).unwrap()
      .then((res) => {
        if(res.commentId === Number(commentId)) {
          setFocusReplyCommnet(res);
        } else {
          setFocusReplyCommnet(null);
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
    if(!isNaN(commentId)) {
      getCommentById(commentId).unwrap()
      .then((res) => {
        if(res.postId === postId) {
          setFocusCommnet(res);
        } else {
          setFocusCommnet(null);
        }    
      })
      .catch((err) => {
        console.log(err);
      })
    }
    return (() => {
      setFocusCommnet(null);
      setFocusReplyCommnet(null);
    })
  },[commentId, replyId]);
   
    useEffect(() => {
      if(newComment) {
        setOwnComments((pre) => [newComment, ...pre])
      }
    },[newComment]);

   useEffect(() => {
    getOwnCmt(postId).unwrap()
    .then((data) => {
      setOwnComments(data.filter((x) => x.id !== Number(commentId)));
    })
    .catch(err => {
      console.log(err);
    });

    return (() => {
      setOwnComments([]);
    })
   },[commentId, replyId])

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
    if(currentPage > 0 && !isLast) {
      setLoading(true);
      getComments({postId: postId, page: currentPage, pageSize: pageSize}).unwrap()
      .then((data) => {
         const filterData = data.content.filter((x) => {
            return !comments.some((existingItem) => existingItem.id === x.id) && x.id !== Number(commentId);
          });
          setComments((pre) => [...pre, ...filterData]);
          setIsLast(data.last);
      }).catch((err) => {
        console.log(err);
        toast.error("Error on page load.");
      }).finally(() => {
        setLoading(false);
      });
      
    }
  },[currentPage])

   useEffect(() => {
    const fetchData = () => {
      setLoading(true);
       getComments({postId: postId, page:0, pageSize: pageSize})
       .unwrap()
       .then((data) => {
        setComments(data.content.filter((x) => x.id !== Number(commentId)));
        setIsLast(data.last);
        setLoading(false);
       })
       .catch((error) => {
        loadMoreRef.current = false;
        console.log(error);
        toast.error("Error on page load.");
        setLoading(false);
       })
      }
    fetchData();

    return () => {
      setCurrentPage(0);
      setIsLast(false);
    }
  }, [commentId])

  if(isLast && comments.length === 0 && ownComments.length === 0) {
    return (
     <div style={{minHeight:"200px"}}>
        <h4 className="text-center mt-5">No comments yet.</h4>
        <p className="text-center mb-5">Start the conversation.</p>
    </div>
    );
  }

  return (
    <>
    <div className="comment-view-box" style={{minHeight:"250px"}}>
        {focusComment !== null &&
          <div ref={focusCommentRef} style={{backgroundColor:"#F3f3f3"}} className="py-2 px-1 my-1">
             <CommentBox comment={focusComment} setCommentCount={setCommentCount} fillterComments={handleDeleteComment} replyCommentFocus={focusReplyComment}/>
          </div>
       }
        {(ownComments.length > 0) && (
          ownComments.map((c) => <CommentBox comment={c} key={c.id} setCommentCount={setCommentCount} fillterComments={handleDeleteComment}/>)
        )}
        {comments.length > 0 &&
          comments.map((c) => (
            <CommentBox comment={c} key={c.id} setCommentCount={setCommentCount}/>
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
    </>
  )
}

export default Comments