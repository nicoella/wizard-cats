package WizardCats.backend.service;

import WizardCats.backend.entities.UserEntity;
import WizardCats.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity registerUser(String username, String password) {
        UserEntity newUser = new UserEntity(username, password);
        return userRepository.save(newUser);
    }

    public UserEntity signIn(String username, String password) {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            return null;
        }
        if (password.equals(user.getPassword())) {
            return user;
        } else {
            return null;
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