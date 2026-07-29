package apnabank_backend.respository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import apnabank_backend.model.Card;

public interface CardRepository extends JpaRepository<Card,Long>{
    Optional<Card> findByAccountId(Long accountId);
}
