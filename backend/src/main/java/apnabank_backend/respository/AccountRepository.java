package apnabank_backend.respository;

import org.springframework.stereotype.Repository;

import apnabank_backend.model.Account;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AccountRepository extends JpaRepository<Account,Long>{
    
    // Find all accounts belonging to a user (Checking & Savings)
    List<Account>findByUserId(Long userId);

     // Find account by its unique 10-digit number
    Optional<Account> findByAccountNumber(String accountNumber);

     /**
     * CRITICAL FOR BANKING: Pessimistic Write Lock
     * Issues a SQL query: "SELECT * FROM accounts WHERE id = ? FOR UPDATE"
     * Locks the database row so no other concurrent transaction can modify
     * the balance while a transfer is executing.
     */

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdWithLock(@Param("id") Long id);
    
    
}
