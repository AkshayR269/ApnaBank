package apnabank_backend;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class ApnabankBackendApplication {

	 // STATIC BLOCK: Runs BEFORE Spring Boot or JDBC connections initialize!
    static {
        System.setProperty("user.timezone", "UTC");
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

	public static void main(String[] args) {
		SpringApplication.run(ApnabankBackendApplication.class, args);
	}

}
