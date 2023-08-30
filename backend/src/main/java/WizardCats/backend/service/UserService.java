package WizardCats.backend.service;

import WizardCats.backend.entities.UserEntity;
import WizardCats.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> registerUser(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Username already exists.");
        }

        UserEntity newUser = new UserEntity(username, password);
        return ResponseEntity.ok(userRepository.save(newUser));
    }

    public ResponseEntity<?> signIn(String username, String password) {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Username doesn't exist.");
        } else if (password.equals(user.getPassword())) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Password is incorrect.");
        }
    }

    public UserEntity updateStats(String username, int playedAdd, int winsAdd) {
        UserEntity user = userRepository.findByUsername(username);

        if (user != null) {
            user.setGamesPlayed(user.getGamesPlayed() + playedAdd);
            user.setWins(user.getWins() + winsAdd);
            return userRepository.save(user);
        }

        return null;
    }
}