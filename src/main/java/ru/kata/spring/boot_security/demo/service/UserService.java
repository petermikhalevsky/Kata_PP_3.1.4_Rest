package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;


public interface UserService extends UserDetailsService {
    List<User> getAllUsers();

    void addUser(User user);

    void addUser(User user, String[] selectRoles);

    void updateUser(User user);

    void updateUser(User user, String[] selectRoles);

    void removeUser(long id);

    User getUserById(long id);

    User getUserByName(String name);

}