package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService{

    User getById(long id);

    List<User> allUsers();

    boolean save(User user);

    boolean delete(Long id);

    void edit(User user);

}
