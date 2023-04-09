import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/functionUtils'
import ImageSlider from '../imageSlider/ImageSlider'
import { useDislikePostMutation, useLikePostMutation } from '../../app/services/posts.service';

function Post({ p }) {

  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();

  const handleLikePost = (liked, postId) => {
    if (liked) {
      dislikePost(postId)
        .unwrap()
        .then(() => {
        //   alert("dislike");
        })
        .catch((err) => alert(err));
    } else {
      likePost(postId)
        .unwrap()
        .then(() => {
        //   alert("liked");
        })
        .catch((err) => {
          alert(err);
          console.log(err)
        });
    }
  };

  return (
    <div className="col-sm-6 offset-sm-3">
        
    <div className="post-block border">
      <div className="d-flex justify-content-between">
        <div className="d-flex mb-3">
          <div className="me-2">
            <a href="#" className="text-dark">
              <img
                src={p.userAvatar ? `http://localhost:8080${p.userAvatar}` : "../../../public/user.jpg" }
                alt="User"
                className="author-img"
              />
            </a>
          </div>
          <div>
            <h5 className="mb-0">
              <a href="#!" className="text-dark">
                {p.userName}
              </a>
            </h5>
            <p className="mb-0 text-muted time-post">{formatDate(p.post.createdAt)}</p>
          </div>
        </div>

        {/* edit xoa */}

        <div className="post-block__user-options dropdown">
          <a
            className="nav-link"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-lg-end"
            aria-labelledby="dropdownMenu2"
          >
            <a className="dropdown-item text-dark text-center" href="#">
            <i className="fa fa-pencil me-1"></i>Edit
            </a>
            <a role="button" className="dropdown-item text-danger text-center">
              Repost
            </a>
          </ul>
        </div>
      </div>

      {/* content */}
      <div className="post-block__content mb-2">
        <p>
            {p.post.content}
        </p>
        <ImageSlider data={p.post.imageUrls} / >
      </div>
      <div className="mb-3 border-top">
        <div className="d-flex justify-content-between mb-2 mt-3">
          <div className="d-flex">
            <a
                  role="button"
                  onClick={() => handleLikePost(p.liked, p.post.id)}
                  className={p.liked ? "text-danger mr-2 interact" : "text-dark mr-2 interact"}
                >
                  <span>
                  <i class={p.liked ? "fa fa-heart" : "fa-regular fa-heart"}></i>
                  </span>
                </a>
            <a href="#!" className="text-dark ms-3 interact">
              <span>
                <i class="fa-regular fa-comment"></i>
              </span>
            </a>
            <a href="#!" className="text-dark ms-3 interact">
              <span>
                <i class="fa-regular fa-paper-plane"></i>
              </span>
            </a>
          </div>
          <a href="#!" className="text-dark interact">
            <span>
              <i class="fa-regular fa-bookmark"></i>
            </span>
          </a>
        </div>
        <div className="mb-0 d-flex count-interact">
          <span className="text-dark">{p.likeCount} likes</span>
          {/* <span className="text-dark ms-auto">2k comments</span> */}
        </div>
      </div>
      {/* <hr /> */}
      <div className="post-block__comments">
        {/* <!-- Comment Input --> */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add your comment"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              id="button-addon2"
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
        {/* <!-- Comment content --> */}
        {/* <div className="comment-view-box mb-3">
          <div className="d-flex mb-2">
            <div>
              <h6 className="mb-1">
                <a href="#!" className="text-dark ">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3QLKE2uwuNuRA7wm5VKxwygySQAhafNN1GQ&usqp=CAU"
                    alt="User img"
                    className="author-img author-img--small me-2"
                  />
                  John doe
                </a>{" "}
                <small className="text-muted">1m</small>
              </h6>
              <p className="mb-0 ms-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing
                elit.
              </p>
              <div className="d-flex ms-5">
                <a
                  href="#!"
                  className="text-dark me-2 interact-comment"
                >
                  <span>
                    <i class="fa-regular fa-heart"></i>
                  </span>
                </a>
                <a
                  href="#!"
                  className="text-dark me-2 interact-comment"
                >
                  <span>Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div> */}
        {/* <!-- More Comments --> */}
        {/* <hr /> */}
        <a href="#!" className="text-dark view-more-coment">
          View More comments{" "}
          <span className="font-weight-bold">({p.commentCount})</span>
        </a>
      </div>
    </div>
  </div>
  )
}

export default Post