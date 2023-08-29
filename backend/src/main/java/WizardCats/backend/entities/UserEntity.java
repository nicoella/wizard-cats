package WizardCats.backend.entities;

import javax.persistence.*;

@Table(name = "users")
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int gamesPlayed;

    @Column(nullable = false)
    private int wins;

    public UserEntity() {
        this.username = "";
        this.password = "";
        this.gamesPlayed = 0;
        this.wins = 0;
    }

    public UserEntity(String username, String password) {
        this.username = username;
        this.password = password;
        this.gamesPlayed = 0;
        this.wins = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }    
}