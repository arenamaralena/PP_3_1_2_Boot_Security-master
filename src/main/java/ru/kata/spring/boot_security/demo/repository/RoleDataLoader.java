package ru.kata.spring.boot_security.demo.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.annotation.PostConstruct;

@Component
public class RoleDataLoader {

    @Autowired
    private RoleRepository roleRepository;

    @PostConstruct
    public void loadData() {
        // Проверка, существуют ли роли, и добавление их, если нет
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ROLE_USER"));
            roleRepository.save(new Role("ROLE_ADMIN"));
        }
    }
}
