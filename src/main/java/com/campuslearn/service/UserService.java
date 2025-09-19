package com.campuslearn.service;

import com.campuslearn.model.User;
import com.campuslearn.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String name, String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("User with this email already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        // For simplicity, we'll set a default password and role
        user.setPassword("password");
        user.setRole("STUDENT");

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    }
}
