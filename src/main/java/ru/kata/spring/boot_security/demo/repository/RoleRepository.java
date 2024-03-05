package ru.kata.spring.boot_security.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.Set;


public interface RoleRepository {
    Set<Role> getAllRole();

    Role getRoleById(Long id);

    Role getRoleByName(String name);
}
