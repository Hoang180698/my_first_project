package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Query("select p from Post p where p.user = ?1 order by p.createdAt DESC ")
    List<Post> findAllByUser(User user);

    @Query("select p from Post p left join Follow f on f.follower.id = ?1"
            + " where p.user.id = f.following.id order by p.createdAt DESC ")
    List<Post> getPostFollowing(Integer id);
}
