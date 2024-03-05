package ru.kata.spring.boot_security.demo.repository;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Repository
public class UserRepositoryImp implements UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User findByUsername(String username) {
        return (User) entityManager.createQuery("select u from User u left join fetch u.roles where u.email=:username")
                .setParameter("username", username)
                .getSingleResult();
    }

    @Override
    public List<User> getAllUsers() {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> from = criteriaQuery.from(User.class);
        criteriaQuery.select(from);
        return entityManager.createQuery(criteriaQuery).getResultList();
    }

    @Override
    public void addUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public void removeUser(Long id) {
        entityManager.remove(entityManager.find(User.class, id));
    }

    @Override
    public User getUserById(Long id) {
        return entityManager.find(User.class, id);
    }
}
