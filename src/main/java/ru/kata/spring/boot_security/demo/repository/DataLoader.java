package ru.kata.spring.boot_security.demo.repository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class DataLoader {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void loadRoleData() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ROLE_USER"));
            roleRepository.save(new Role("ROLE_ADMIN"));
        }

        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN");
            User admin1 = new User(null,"Admin", 30, "admin", "admin", "admin", List.of(adminRole));
            admin1.setPassword(passwordEncoder.encode("admin"));
            userRepository.save(admin1);
            Role userRole = roleRepository.findByName("ROLE_USER");
            User user = new User(null,"user", 30, "user", "user", "user", List.of(userRole));
            user.setPassword(passwordEncoder.encode("user"));
            userRepository.save(user);
        }
    }
}
