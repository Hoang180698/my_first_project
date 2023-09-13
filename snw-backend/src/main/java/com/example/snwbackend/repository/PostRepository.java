package com.example.snwbackend.repository;

import com.example.snwbackend.dto.PostDto;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Page<Post> findAllByUser_IdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    @Query("select p from Post p left join Follow f on f.follower.id = ?1"
            + " where p.user.id = f.following.id order by p.createdAt DESC ")
    Page<Post> getPostFollowing(Integer userId, Pageable pageable);

    @Query("select p from Post p left join Save s on s.user.id = ?1 " +
            "where p.id = s.post.id order by s.createdAt DESC")
    Page<Post> getSavedPosts(Integer userId, Pageable pageable);

    Set<Post> findByIdIn(List<Integer> ids);

    @Query("select new com.example.snwbackend.dto.PostDto" +
            "(p, (exists(select 1 FROM Like l WHERE l.user.id = ?2 AND l.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar, " +
            "(exists(select 1 FROM Save s WHERE s.user.id = ?2 AND s.post.id = p.id)))"+
            "from Post p where p.id = ?1")
    Optional<PostDto> getPostDtoById(Integer id, Integer userSendRqId);

//    @Query("select new com.example.snwbackend.dto.PostDto" +
//            "(p.id, p.content, p.createdAt, p.updatedAt," +
//            "count(l1.id) ,count(c.id), (exists(select 1 FROM Like l2 WHERE l2.user.id = ?1 AND l2.post.id = p.id))," +
//            " p.user.id, p.user.name, p.user.avatar)"+
//            "from Post p left join Like l1 on l1.post.id = p.id left join Comment c on c.post.id = p.id where " +
//            "p.user.id = ?1 group by p.id order by p.createdAt DESC")
//    List<PostDto> getPostDtoByUser(Integer userId);


    @Query( "select new com.example.snwbackend.dto.PostDto" +
            "(p, (exists(select 1 FROM Like l WHERE l.user.id = ?2 AND l.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar, " +
            "(exists(select 1 FROM Save s WHERE s.user.id = ?2 AND s.post.id = p.id)))"+
            "from Post p  where " +
            "p.user.id = ?1 group by p.id order by p.createdAt DESC")
    List<PostDto> getPDtoByUser(Integer userId, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.PostDto" +
            "(p, (exists(select 1 FROM Like l2 WHERE l2.user.id = ?1 AND l2.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar, " +
            "(exists(select 1 FROM Save s WHERE s.user.id = ?1 AND s.post.id = p.id)))"+
            "from Post p left join Follow f on f.follower.id =?1" +
            "where p.user.id = f.following.id group by p.id order by p.createdAt DESC")
    List<PostDto> getPDtoFollowing(Integer userId);

    @Query("select new com.example.snwbackend.dto.PostDto" +
            "(p, (exists(select 1 FROM Like l2 WHERE l2.user.id = ?1 AND l2.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar, " +
            "(exists(select 1 FROM Save s WHERE s.user.id = ?1 AND s.post.id = p.id)))"+
            "from Post p left join Like l1 on l1.post.id = p.id left join Comment c on c.post.id = p.id  " +
            "where p.user.id = ?1 group by p.id order by p.createdAt DESC")
    List<PostDto> getOwnPostDtoLimit(Integer userId, Integer limit);

    @Query("select new com.example.snwbackend.dto.PostDto" +
            "(p, (exists(select 1 FROM Like l2 WHERE l2.user.id = ?1 AND l2.post.id = p.id))," +
            " p.user.id, p.user.name, p.user.avatar, " +
            "(exists(select 1 FROM Save s WHERE s.user.id = ?1 AND s.post.id = p.id)))"+
            "from Post p left join Save s on s.user.id =?1" +
            "where p.id = s.post.id group by p.id order by s.createdAt DESC")
    List<PostDto> getAllSavedPost(Integer userId);

    Integer countByUser_Id(Integer userId);
}
