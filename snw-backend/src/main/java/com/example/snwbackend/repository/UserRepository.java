package com.example.snwbackend.repository;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    @Query("select new com.example.snwbackend.dto.UserDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender)"
            + "from User u where upper(u.name) like upper(concat('%', ?1, '%'))"
    )
    List<UserDto> findByKeyword(String name);

    @Query("select new com.example.snwbackend.dto.UserDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender)"
            + "from User u left join Follow fl on fl.follower.id = ?1 where u.id = fl.following.id"
    )
    List<UserDto> getUsersFollowing(Integer id);

    @Query("select new com.example.snwbackend.dto.UserDto(u.id, u.name, u.email, u.phone, u.address, u.Biography, u.avatar, u.gender)"
            + "from User u left join Follow fl on fl.following.id = ?1 where u.id = fl.follower.id"
    )
    List<UserDto> getUsersFollower(Integer id);
}
