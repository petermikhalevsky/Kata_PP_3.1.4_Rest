package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.HashSet;
import java.util.List;

@Service
public class UserServiceImp implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder bCryptPasswordEncoder;
    private RoleRepository roleRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository, PasswordEncoder bCryptPasswordEncoder,
                                  RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.roleRepository = roleRepository;
    }


    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Override
    @Transactional
    public void addUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.addUser(user);
    }

    @Override
    public void addUser(User user, String[] selectRoles) {
        addUser(setSelectedRoles(user, selectRoles));
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        if (!user.getPassword().isEmpty()) {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(getUserById(user.getId()).getPassword());
        }
        userRepository.updateUser(user);
    }

    @Override
    @Transactional
    public void updateUser(User user, String[] selectRoles) {
        updateUser(setSelectedRoles(user, selectRoles));
    }

    @Override
    @Transactional
    public void removeUser(long id) {
        userRepository.removeUser(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(long id) {
        return userRepository.getUserById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByName(String name) {
        return userRepository.findByUsername(name);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '%s' not found", username));
        }
        return user;
    }

    private User setSelectedRoles(User user, String[] selectRoles) {
        user.setRoles(new HashSet<>());
        for (String role : selectRoles) {
            user.addRole(roleRepository.getRoleByName(role));
        }
        return user;
    }
}

