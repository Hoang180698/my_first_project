import React from 'react'

function ProfilePost() {
  return (
    <>
            <section className="main-content">
        <div className="container">
          <h1 className="text-center text-uppercase">Social Media Post</h1>
          <br />
          <br />

          <div className="row">
            <div className="col-sm-6 offset-sm-3">
              <div className="post-block">
                <div className="d-flex justify-content-between">
                  <div className="d-flex mb-3">
                    <div className="me-2">
                      <a href="#" className="text-dark">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3QLKE2uwuNuRA7wm5VKxwygySQAhafNN1GQ&usqp=CAU"
                          alt="User"
                          className="author-img"
                        />
                      </a>
                    </div>
                    <div>
                      <h5 className="mb-0">
                        <a href="#!" className="text-dark">
                          Kiran Acharya
                        </a>
                      </h5>
                      <p className="mb-0 text-muted">5m</p>
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
                      <a className="dropdown-item text-dark" href="#">
                        <i className="fa fa-pencil me-1"></i>Edit
                      </a>
                      <a className="dropdown-item text-danger" href="#">
                        <i className="fa fa-trash me-1"></i>Delete
                      </a>
                    </ul>
                  </div>
                </div>

                {/* content */}
                <div className="post-block__content mb-2">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ratione laboriosam non atque, porro cupiditate commodi?
                    Provident culpa vel sit enim!
                  </p>
                  <div className="post-image">
                  <img
                    src="https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/06_2020/ve-dep-khach-san-sonasea-phu-quoc.jpg"
                    alt="Content img"
                  />
                  </div>
                
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2 mt-3">
                    <div className="d-flex">
                      <a href="#!" className="text-danger mr-2 interact">
                        <span>
                          <i className="fa fa-heart"></i>
                        </span>
                      </a>
                      <a href="#!" className="text-dark ms-3 interact">
                          <span><i class="fa-regular fa-comment"></i></span>
                      </a>
                      <a href="#!" className="text-dark ms-3 interact">
                          <span><i class="fa-regular fa-paper-plane"></i></span>
                      </a>
                    </div>
                    <a href="#!" className="text-dark interact">
                      <span><i class="fa-regular fa-bookmark"></i></span>
                    </a>
                  </div>
                  <div className="mb-0 d-flex count-interact">
                    <span className="text-dark">25k likes</span>
                    <span className="text-dark ms-auto">2k comments</span>
                  </div>
                </div>
                <hr />
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
                  <div className="comment-view-box mb-3">
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
                          <a href="#!" className="text-dark me-2 interact-comment">
                            <span>
                            <i class="fa-regular fa-heart"></i>
                            </span>
                          </a>
                          <a href="#!" className="text-dark me-2 interact-comment">
                            <span>Reply</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- More Comments --> */}
                  <hr />
                  <a href="#!" className="text-dark view-more-coment">
                    View More comments{" "}
                    <span className="font-weight-bold">(12)</span>
                  </a>
                </div>
              </div>
            </div>

            {/*  */}
            
            <div className="col-sm-6 offset-sm-3">
              <div className="post-block">
                <div className="d-flex justify-content-between">
                  <div className="d-flex mb-3">
                    <div className="me-2">
                      <a href="#" className="text-dark">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3QLKE2uwuNuRA7wm5VKxwygySQAhafNN1GQ&usqp=CAU"
                          alt="User"
                          className="author-img"
                        />
                      </a>
                    </div>
                    <div>
                      <h5 className="mb-0">
                        <a href="#!" className="text-dark">
                          Kiran Acharya
                        </a>
                      </h5>
                      <p className="mb-0 text-muted">5m</p>
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
                      <a className="dropdown-item text-dark" href="#">
                        <i className="fa fa-pencil me-1"></i>Edit
                      </a>
                      <a className="dropdown-item text-danger" href="#">
                        <i className="fa fa-trash me-1"></i>Delete
                      </a>
                    </ul>
                  </div>
                </div>

                {/* content */}
                <div className="post-block__content mb-2">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ratione laboriosam non atque, porro cupiditate commodi?
                    Provident culpa vel sit enim!
                  </p>
             
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex ">
                      <a href="#!" className="text-danger mr-2 interact">
                        <span>
                          <i className="fa fa-heart"></i>
                        </span>
                      </a>
                      <a href="#!" className="text-dark ms-3 interact">
                          <span><i class="fa-regular fa-comment"></i></span>
                      </a>
                      <a href="#!" className="text-dark ms-3 interact">
                          <span><i class="fa-regular fa-paper-plane"></i></span>
                      </a>
                    </div>
                    <a href="#!" className="text-dark interact">
                      <span><i class="fa-regular fa-bookmark"></i></span>
                    </a>
                  </div>
                  <div className="mb-0 d-flex count-interact">
                    <span className="text-dark">25k likes</span>
                    <span className="text-dark ms-auto">2k comments</span>
                  </div>
                </div>
                <hr />
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
                  <div className="comment-view-box mb-3">
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
                          <a href="#!" className="text-dark me-2 interact-comment">
                            <span>
                            <i class="fa-regular fa-heart"></i>
                            </span>
                          </a>
                          <a href="#!" className="text-dark me-2 interact-comment">
                            <span>Reply</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- More Comments --> */}
                  <hr />
                  <a href="#!" className="text-dark view-more-coment">
                    View More comments{" "}
                    <span className="font-weight-bold">(12)</span>
                  </a>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>
    </>
  )
}

export default ProfilePost