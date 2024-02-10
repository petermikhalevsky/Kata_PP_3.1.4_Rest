package ru.kata.spring.boot_security.demo.models;

import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "role")
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role", nullable = false, unique = true)
    private String role;
    @Transient
    @ManyToMany(mappedBy = "role")
    private Set<User> usersByRole = new HashSet<>();

    public Role() {
    }
    public Role(Long id) {
        this.id = id;
    }

    public Role(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<User> getUsersByRole() {
        return usersByRole;
    }

    public void setUsersByRole(Set<User> usersByRole) {
        this.usersByRole = usersByRole;
    }

    @Override
    public String toString() {
        return role;
    }

    @Override
    public String getAuthority() {
        return role;
    }

}