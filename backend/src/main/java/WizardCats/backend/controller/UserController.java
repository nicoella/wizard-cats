package WizardCats.backend.controller;

import WizardCats.backend.entities.UserEntity;
import WizardCats.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String root() {
        return "Welcome.";
    }

    @GetMapping("/hello")
    public String hello(@RequestParam String request) {
        return "Hello! " + request;
    }

    @PostMapping("/register")
    public UserEntity registerUser(@RequestBody AccountRequest request) {
        return userService.registerUser(request.getUsername(), request.getPassword());
    }

    @GetMapping("/signIn")
    public UserEntity signIn(@RequestParam AccountRequest request) {
        return userService.signIn(request.getUsername(), request.getPassword());
    }

    @PostMapping("/updateStats")
    public UserEntity updateStats(@RequestBody AccountRequest request,
                                        @RequestParam Integer playedAdd,
                                        @RequestParam Integer winsAdd) {
        return userService.updateStats(request.getUsername(), playedAdd, winsAdd);
    }
    
    public static class AccountRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}