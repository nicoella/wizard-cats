package WizardCats.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "WizardCats.backend.*")
@EnableJpaRepositories
@ComponentScan(basePackages = { "WizardCats.backend.base.*", "WizardCats.backend.controller", "WizardCats.backend.service" }) 
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
