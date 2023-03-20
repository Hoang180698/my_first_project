import React from 'react';
 import "./sass/style.scss";

function Notify() {
  return (
    <>
    <section class="section-50">
		<div class="container">
			<h3 class="m-b-50 heading-line">Notifications <i class="fa fa-bell text-muted"></i></h3>

			<div class="notification-ui_dd-content">
				<a class="notification-list notification-list--unread text-dark">
					<div class="notification-list_content">
						<div class="notification-list_img">
							<img src="images/users/user1.jpg" alt="user" />
						</div>
						<div class="notification-list_detail">
							<p><b>John Doe</b> reacted to your post</p>
							<p class="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
							<p class="text-muted"><small>10 mins ago</small></p>
						</div>
					</div>
					<div class="notification-list_feature-img">
						<img src="images/features/random1.jpg" alt="Feature image" />
					</div>
				</a>
        {/*  */}
				<a class="notification-list notification-list--unread text-dark">
					<div class="notification-list_content">
						<div class="notification-list_img">
							<img src="images/users/user2.jpg" alt="user" />
						</div>
						<div class="notification-list_detail">
							<p><b>Richard Miles</b> liked your post</p>
							<p class="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
							<p class="text-muted"><small>10 mins ago</small></p>
						</div>
					</div>
					<div class="notification-list_feature-img">
						<img src="images/features/random2.jpg" alt="Feature image" />
					</div>
				</a>
        {/*  */}
				<a class="notification-list text-dark">
					<div class="notification-list_content">
						<div class="notification-list_img">
							<img src="images/users/user3.jpg" alt="user" />
						</div>
						<div class="notification-list_detail">
							<p><b>Brian Cumin</b> reacted to your post</p>
							<p class="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
							<p class="text-muted"><small>10 mins ago</small></p>
						</div>
					</div>
					<div class="notification-list_feature-img">
						<img src="images/features/random3.jpg" alt="Feature image" />
					</div>
				</a>
        {/*  */}
				<a class="notification-list text-dark">
					<div class="notification-list_content">
						<div class="notification-list_img">
							<img src="images/users/user4.jpg" alt="user" />
						</div>
						<div class="notification-list_detail">
							<p><b>Lance Bogrol</b> reacted to your post</p>
							<p class="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
							<p class="text-muted"><small>10 mins ago</small></p>
						</div>
					</div>
					<div class="notification-list_feature-img">
						<img src="images/features/random4.jpg" alt="Feature image" />
					</div>
				</a>

			</div>

			<div class="text-center">
				<a href="#!" class="dark-link load-more">Load more activity</a>
			</div>

		</div>
	</section>
    </>
  )
}

export default Notify