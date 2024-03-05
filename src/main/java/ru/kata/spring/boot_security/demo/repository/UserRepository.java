package ru.kata.spring.boot_security.demo.repository;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;


public interface UserRepository{
    User findByUsername (String username);

    List<User> getAllUsers();

    void addUser(User user);

    void updateUser(User user);

    void removeUser(Long id);

    User getUserById(Long id);
}
