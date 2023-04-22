package com.example.snwbackend.repository;

import com.example.snwbackend.dto.UserDetailDto;
import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender, u.birthday, " +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)))"
            + "from User u where u.phone = ?1 or upper(u.name) like upper(concat('%', ?1, '%'))"
    )
    List<UserDetailDto> findByKeyword(String key, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender, u.birthday, " +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)))"
            + "from User u left join Follow fl on fl.follower.id = ?1 where u.id = fl.following.id"
    )
    List<UserDetailDto> getUsersFollowing(Integer id, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender, u.birthday, " +
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)))"
            + "from User u left join Follow fl on fl.following.id = ?1 where u.id = fl.follower.id"
    )
    List<UserDetailDto> getUsersFollower(Integer id, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender, u.birthday,"+
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = ?1)))" +
            "from User u where  u.id = ?1")
    Optional<UserDetailDto> findUserDetailDtoById(Integer id, Integer userSendRqId);

    @Query("select new com.example.snwbackend.dto.UserDetailDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender, u.birthday,"+
            "(exists(select 1 from Follow f where f.follower.id = ?2 and f.following.id = u.id)))" +
            "from User u left join Like l on l.post.id = ?1 where u.id = l.user.id")
    List<UserDetailDto> findUserDetailDtoLikePost(Integer postId, Integer userSendRqId);
}
