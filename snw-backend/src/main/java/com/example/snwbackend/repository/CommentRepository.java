package com.example.snwbackend.repository;

import com.example.snwbackend.dto.CommentDto;
import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Query("select new com.example.snwbackend.dto.CommentDto" +
            "(c.id, c.content, c.createdAt, c.likeCount, c.replyCount,"+
            "c.user.id, c.user.name, c.user.avatar, " +
            "(exists(select 1 from LikeComment lc where lc.user.id = ?2 and lc.comment.id = c.id)), c.post.id)" +
            " from Comment c where c.post.id = ?1 and c.user.id = ?2" +
            " order by c.createdAt DESC")
    List<CommentDto> getAllOwnCmtDtoByPost(Integer postId, Integer userId);

    Page<Comment> getAllByPost_Id(Integer postId, Pageable pageable);

    @Query("select cmt from Comment cmt where cmt.post.id = ?1 and cmt.user.id = ?2")
    List<Comment> getAllOwnCmtByPostId(Integer postId, Integer userId);

    @Query("select cmt from Comment cmt where cmt.post.id = ?1 and not cmt.user.id = ?2")
    Page<Comment> getAllOtherUserCmtByPostId(Integer postId, Integer userId, Pageable pageable);

    @Modifying
    void deleteAllByPost(Post post);

}
