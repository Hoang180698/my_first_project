package com.example.snwbackend.repository;

import com.example.snwbackend.dto.PostDto;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Query("select p from Post p where p.user = ?1 order by p.createdAt DESC ")
    List<Post> findAllByUser(User user);

    @Query("select p from Post p left join Follow f on f.follower.id = ?1"
            + " where p.user.id = f.following.id order by p.createdAt DESC ")
    List<Post> getPostFollowing(Integer userId);

    @Query("select new com.example.snwbackend.dto.PostDto" +
            "(p, count(l1.id), count(c.id), (exists(select 1 FROM Like l2 WHERE l2.user.id = ?2 AND l2.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar)"+
            "from Post p left join Like l1 on l1.post.id = p.id left join Comment c on c.post.id = p.id " +
            "where p.id = ?1")
    Optional<PostDto> getPostDtoById(Integer id, Integer userSendRqId);

//    @Query("select new com.example.snwbackend.dto.PostDto" +
//            "(p.id, p.content, p.createdAt, p.updatedAt," +
//            "count(l1.id) ,count(c.id), (exists(select 1 FROM Like l2 WHERE l2.user.id = ?1 AND l2.post.id = p.id))," +
//            " p.user.id, p.user.name, p.user.avatar)"+
//            "from Post p left join Like l1 on l1.post.id = p.id left join Comment c on c.post.id = p.id where " +
//            "p.user.id = ?1 group by p.id order by p.createdAt DESC")
//    List<PostDto> getPostDtoByUser(Integer userId);

    @Modifying
    @Query( value = "select new com.example.snwbackend.dto.PostDto" +
            "(p, count(l1.id), count(c.id), (exists(select 1 FROM Like l2 WHERE l2.user.id = ?2 AND l2.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar)"+
            "from Post p left join Like l1 on l1.post.id = p.id left join Comment c on c.post.id = p.id where " +
            "p.user.id = ?1 group by p.id order by p.createdAt DESC")
    List<PostDto> getPDtoByUser(Integer userId, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.PostDto" +
            "(p, count(l1.id), count(c.id), (exists(select 1 FROM Like l2 WHERE l2.user.id = ?1 AND l2.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar)"+
            "from Post p left join Like l1 on l1.post.id = p.id left join Comment c on c.post.id = p.id  " +
            "left join Follow f on f.follower.id =?1" +
            "where p.user.id = f.following.id group by p.id order by p.createdAt DESC")
    List<PostDto> getPDtoFollowing(Integer userId);

}
