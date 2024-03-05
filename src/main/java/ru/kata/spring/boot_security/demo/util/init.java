package ru.kata.spring.boot_security.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;

@Component
public class init {

    private UserService userService;
    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public void setUserService(UserService userService, PasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostConstruct
    public void runAfterStartup() {
        User admin = new User();
        admin.setFirstName("ivan");
        admin.setLastName("ivanov");
        admin.setAge(25);
        admin.setEmail("ivanov@mail.ru");
        admin.setPassword("123");
        admin.addRole(new Role("ROLE_ADMIN"));
        userService.addUser(admin);

        User user = new User();
        user.setFirstName("petr");
        user.setLastName("petrov");
        user.setAge(40);
        user.setEmail("petrov@mail.ru");
        user.setPassword("123");
        user.addRole(new Role("ROLE_USER"));
        userService.addUser(user);
    }
}
