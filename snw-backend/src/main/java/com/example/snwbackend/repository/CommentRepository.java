package com.example.snwbackend.repository;

import com.example.snwbackend.dto.CommentDto;
import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Query("select new com.example.snwbackend.dto.CommentDto" +
            "(c.id, c.content, c.createdAt, c.updatedAt, c.post.id,"+
            "c.user.id, c.user.name, c.user.avatar) from Comment c where c.post.id = ?1" +
            " order by c.createdAt ASC")
    List<CommentDto> getAllCmtDtoByPost(Integer postId, Integer userId);

    Page<Comment> getAllByPost_Id(Integer postId, Pageable pageable);

    void deleteAllByPost(Post post);

}
