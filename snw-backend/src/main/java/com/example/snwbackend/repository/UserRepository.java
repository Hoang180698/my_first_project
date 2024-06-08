package com.example.snwbackend.repository;

import com.example.snwbackend.dto.UserDetailDto;
import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Set<User> findByIdIn(List<Integer> ids);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.biography, u.avatar, u.gender, u.birthday, " +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)), u.isOnline)"
            + "from User u where u.phone = ?1 or upper(u.name) like upper(concat('%', ?1, '%'))"
    )
    List<UserDetailDto> findByKeyword(String key, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.biography, u.avatar, u.gender, u.birthday, " +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)), u.isOnline)"
            + "from User u left join Follow fl on fl.follower.id = ?1 where u.id = fl.following.id"
    )
    List<UserDetailDto> getUsersFollowing(Integer id, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.biography, u.avatar, u.gender, u.birthday, " +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)), u.isOnline)"
            + "from User u left join Follow fl on fl.following.id = ?1 where u.id = fl.follower.id"
    )
    List<UserDetailDto> getUsersFollower(Integer id, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.biography, u.avatar, u.gender, u.birthday," +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = ?1)), u.isOnline)" +
            "from User u where  u.id = ?1")
    Optional<UserDetailDto> findUserDetailDtoById(Integer id, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.biography, u.avatar, u.gender, u.birthday," +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)), u.isOnline)" +
            "from User u left join Like l on l.post.id = ?1 where u.id = l.user.id")
    List<UserDetailDto> findUserDetailDtoLikePost(Integer postId, Integer userSendRqId);

    //      @Query( value = "select u.id, u.name, u.email, u.phone, u.address, u.biography, u.avatar, u.gender, u.birthday," +
//            "(SELECT EXISTS(SELECT * FROM follows fl WHERE fl.follower_id = :userSendRqId AND fl.following_id = u.id))"
//            + "from user u left join follows fl on fl.follower_id = :userId where u.id = fl.following_id",
//            nativeQuery = true
//    )
    @Query("select u from User u where u.phone = ?1 or upper(u.name) like upper(concat('%', ?1, '%'))")
    Page<User> findByKeywordOther(String key, Pageable pageable);

    @Query("select u from User u left join Follow fl on fl.follower.id = ?1 where u.id = fl.following.id")
    Page<User> getUsersFollowingOther(Integer id, Pageable pageable);

    @Query("select u from User u left join Follow fl on fl.following.id = ?1 where u.id = fl.follower.id")
    Page<User> getUsersFollowerOther(Integer id, Pageable pageable);

    @Query("select u from User u left join Like l on l.post.id = ?1 where u.id = l.user.id")
    Page<User> findUserDetailDtoLikePostOther(Integer postId, Pageable pageable);

    @Query("select u from User u left join LikeComment lc on lc.comment.id = ?1 where u.id = lc.user.id")
    Page<User> findUserLikedComment(Integer commentId, Pageable pageable);

    @Query("select u from User  u left join LikeReplyComment l on l.replyComment.id = ?1 where u.id = l.user.id")
    Page<User> findUserLikedReplyComment(Integer replyCommentId, Pageable pageable);
}
