package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {
    void save(User user);
    List<User> findAll();
    void deleteById(Long id);
    Optional<User> findById(Long id);
    void update(User updatedUser);
    void addFirstAdmin();

}