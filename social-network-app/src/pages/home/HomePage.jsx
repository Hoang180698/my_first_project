import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetPostsQuery } from "../../app/services/posts.service";
import useCreatePost from "../newPost/useCreatePost";
import "./sass/style.scss";
// import ImageSlider from "../../components/imageSlider/ImageSlider";
// import { formatDate } from "../../utils/functionUtils";
import Post from "../../components/post/Post";

function HomePage() {
  const { auth } = useSelector((state) => state.auth);
  const { onCreatePost } = useCreatePost();

  const { data, isLoading } = useGetPostsQuery();

  if (isLoading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="main-content">
        <div className="container">
          <div className="col-sm-6 offset-sm-3">
            <div className="post-block">
              <div className="form-body ms-5">
                <Link className="homepage-avatar" to={"/my-profile/"}>
                  {" "}
                  <img
                    src={
                      auth.avatar === null
                        ? "../../../public/user.jpg"
                        : `http://localhost:8080${auth.avatar}`
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
            {data.length > 0 && data.map((p) => <Post p={p} key={p.id} />)};
            {/* ***************** */}
            <div className="col-sm-6 offset-sm-3">
              <div className="post-block text-center">
                <h2>You're all caught up</h2>
                <Link to={"./search"} className="btn btn-primary">
                  find more friends
                </Link>
                <div className="d-flex justify-content-between"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
