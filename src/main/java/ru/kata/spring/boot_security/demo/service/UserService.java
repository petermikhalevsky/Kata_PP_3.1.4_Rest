package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.User;
import java.util.Set;

public interface UserService {
    void add(User user);
    Set<User> listUsers();
    void removeUserById(Long id);
    User findUser(Long id);
    void update(User changedUser);
    void addFirstAdmin();


}