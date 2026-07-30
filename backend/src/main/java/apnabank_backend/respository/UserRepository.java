package apnabank_backend.respository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import apnabank_backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    
    // Used during Login: Find user by email
    Optional<User> findByEmail(String email);
    // Used during Registration: Check if email already exists
    Boolean existsByEmail(String email);
}
