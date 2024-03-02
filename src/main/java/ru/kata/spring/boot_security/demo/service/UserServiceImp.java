package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import static java.util.Set.of;

@Service
public class UserServiceImp implements UserService, UserDetailsService {
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;

    @Autowired
    public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void save(User user) {
        user.setPassword(encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    @Override
    public void update(User updatedUser) {
        Optional<User> user = userRepository.findById(updatedUser.getId());
        if (!user.get().getPassword().equals(updatedUser.getPassword())) {
            updatedUser.setPassword(encode(updatedUser.getPassword()));
        }
        userRepository.save(updatedUser);
    }

    @Transactional
    @Override
    public void addFirstAdmin() {
        if (userRepository.countUsers().equals(0L)) {
            save(getDefaultUser());
            save(getDefaultAdmin());
        }
    }

    private User getDefaultAdmin() {
        return new User("admin", "adminsky", "admin@mail.ru", "123", "admin", of(new Role("admin")));
    }

    private User getDefaultUser() {
        return new User("user", "usersky", "user@mail.ru", "123", "user", of(new Role("user")));
    }

    private String encode(String str) {
        return passwordEncoder.encode(str);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));
    }
}
