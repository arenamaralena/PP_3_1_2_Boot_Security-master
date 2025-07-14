package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String userList(Model model,@AuthenticationPrincipal User admin) {
        model.addAttribute("admin", userService.getById(admin.getId()));
        model.addAttribute("users", userService.allUsers());
        model.addAttribute("user", new User());
        return "adminpage";
    }

    @PostMapping()
    public String create(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String edit(Model model, @RequestParam("id") Long id) {
        model.addAttribute("user", userService.getById(id));
        return "edit";
    }

    @PostMapping("/edit")
    public String update(@ModelAttribute("user") User user) {
        userService.edit(user);
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String delete(@RequestParam("id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }

    @GetMapping("/new")
    public String newUser(@ModelAttribute("user") User user) {
        return "new";
    }

    @GetMapping("/gt/{userId}")
    public String gtUser(@PathVariable("userId") Long userId, Model model) {
        model.addAttribute("allUsers", userService.getById(userId));
        return "admin";
    }
}
