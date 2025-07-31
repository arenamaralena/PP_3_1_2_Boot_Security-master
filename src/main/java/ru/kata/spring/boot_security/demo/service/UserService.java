package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    User getById(Long id);

    List<User> allUsers();

    boolean save(User user);

    boolean delete(Long id);

    void edit(User user);

}
