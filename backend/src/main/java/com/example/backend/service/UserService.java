package com.example.backend.service;

import org.springframework.stereotype.Service;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import java.util.Optional;
import java.util.List;
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initAdminUser() {
        if (userRepository.findByEmail("test@test.com").isEmpty()) {
            UserEntity admin = new UserEntity();
            admin.setEmail("test@test.com");
            admin.setPassword("$2a$12$OBnerD3ZrnkqY/ofkaxune1jnpUscFhTGCcuVA9x5lgAGAtr6Bss2"); // ハッシュ化されたパスワード
            admin.setRole("ROLE_ADMIN");
            admin.setExtraInfo("Admin user");
            userRepository.save(admin);
        }
    }

    public Optional<UserEntity> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserEntity updateUser(Long id, UserEntity updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(updatedUser.getEmail());
                    user.setPassword(updatedUser.getPassword()); // 必要ならハッシュ化
                    user.setRole(updatedUser.getRole());
                    user.setExtraInfo(updatedUser.getExtraInfo());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}