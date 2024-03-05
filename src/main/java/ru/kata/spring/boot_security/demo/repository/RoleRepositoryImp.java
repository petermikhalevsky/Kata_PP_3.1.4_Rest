package ru.kata.spring.boot_security.demo.repository;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class RoleRepositoryImp implements RoleRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Role> getAllRole() {
        return entityManager.createQuery("from Role", Role.class).getResultStream().collect(Collectors.toSet());
    }

    @Override
    public Role getRoleById(Long id) {
        return entityManager.find(Role.class, id);
    }

    @Override
    public Role getRoleByName(String name) throws NoResultException {
        try {
            return (Role) entityManager.createQuery("from Role r where r.role = :role")
                    .setParameter("role", name)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new NoResultException(String.format("Role '%s' not found", name));
        }
    }


}
