package ru.kata.spring.boot_security.demo.repository;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader {

    private final RoleRepository roleRepository;

    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void loadRoleData() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ROLE_USER"));
            roleRepository.save(new Role("ROLE_ADMIN"));
        }
    }
//        if (userRepository.count() == 0) {
//            Role userRole = roleRepository.findByName("ROLE_USER");
//            Role adminRole = roleRepository.findByName("ROLE_ADMIN");
//
//            User user1 = new User("User", 20, "user", "user", "user", new ArrayList<>(List.of(userRole)));
//            user1.setPasswordConfirm("user");
//            user1.setId(1);
//
//            User admin1 = new User("Admin", 30, "admin", "admin", "admin", new ArrayList<>(List.of(adminRole)));
//            admin1.setPasswordConfirm("admin");
//            admin1.setId(2);
//
//            userRepository.save(user1);
//            userRepository.save(admin1);
//        }
//    }



}
