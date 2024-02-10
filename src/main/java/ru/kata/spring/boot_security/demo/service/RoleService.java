package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.Role;
import java.util.Set;

public interface RoleService {
    Role findRole(Long id);
    Set<Role> rolesSet();
    void add(Role role);

}