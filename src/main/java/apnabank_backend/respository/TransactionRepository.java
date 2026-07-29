package apnabank_backend.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import apnabank_backend.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    
    //Retrieve all transactions where an account was either the Sender (Source) OR Receiver (Target)
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.id = :accountId OR t.targetAccount.id = :accountId ORDER BY t.timestamp DESC")
    List<Transaction> findAllByAccountIdOrderByTimestampDesc(@Param("accountId") Long accountId);

    // Find transaction by its unique audit reference number (e.g. "TXN-8F92A1B3")
    Transaction findByReferenceNumber(String referenceNumber);
}
