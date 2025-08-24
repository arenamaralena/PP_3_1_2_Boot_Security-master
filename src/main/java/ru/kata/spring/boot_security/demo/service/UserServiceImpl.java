package ru.kata.spring.boot_security.demo.service;

import org.hibernate.Hibernate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final RoleService roleService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder bCryptPasswordEncoder, RoleService roleService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.roleService = roleService;
    }

    @Transactional(readOnly = true)
    @Override
    public User getById(Long id) {
        User user = userRepository.getById(id);
        Hibernate.initialize(user.getRoles());
        return user;
    }

    @Transactional(readOnly = true)
    @Override
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public boolean save(User user) {
        User userFromDB = userRepository.findByUsername(user.getUsername());
        if (userFromDB != null) {
            return false;
        } else if ((!user.getPassword().equals(user.getPasswordConfirm())) && (user.getPasswordConfirm() != null)) {
            return false;
        } else if ((user.getPasswordConfirm() == null) && (user.getPassword() != null)) {
            user.setPasswordConfirm(user.getPassword());
        }
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role userRole = roleService.findByName("ROLE_USER");
            user.setRoles(List.of(userRole));
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        return true;
    }

    @Transactional
    @Override
    public boolean delete(Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    @Override
    public void edit(User user) {
        Optional<User> optionalUser = userRepository.findById(user.getId());
        if (optionalUser.isPresent()) {
            User editedUser = optionalUser.get();
            editedUser.setFirstName(user.getFirstName());
            editedUser.setLastName(user.getLastName());
            editedUser.setAge(user.getAge());
            userRepository.save(editedUser);
        }
    }
}
