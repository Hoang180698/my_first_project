package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Follow;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Integer> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    Integer countByFollower_Id(Integer followerId);

    Integer countByFollowing_Id(Integer followingId);
    boolean existsByFollower_IdAndFollowing_Id(Integer followerId, Integer followingId);
}
