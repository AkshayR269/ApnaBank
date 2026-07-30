package apnabank_backend.service;

import org.springframework.stereotype.Service;

import apnabank_backend.dto.CardDTO;
import apnabank_backend.exception.ResourceNotFoundException;
import apnabank_backend.exception.UnauthorizedAccessException;
import apnabank_backend.model.Card;
import apnabank_backend.respository.CardRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    public CardDTO getCardByAccountId(Long accountId, Long currentUserId) {
        Card card = cardRepository.findByAccountId(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("No card found for this account"));
        // Verify account owner
        if (!card.getAccount().getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You do not own this card!");
        }
        return mapToCardDTO(card);
    }
    @Transactional
    public CardDTO toggleCardFreeze(Long cardId, Long currentUserId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        // Verify owner
        if (!card.getAccount().getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You do not own this card!");
        }
        // Toggle state: If true -> false, if false -> true
        card.setFrozen(!card.isFrozen());
        Card updatedCard = cardRepository.save(card);
        return mapToCardDTO(updatedCard);
    }
    private CardDTO mapToCardDTO(Card card) {
        return CardDTO.builder()
                .id(card.getId())
                .cardNumber(card.getCardNumber())
                .cardHolderName(card.getCardHolderName())
                .expiryDate(card.getExpiryDate())
                .cvv(card.getCvv())
                .isFrozen(card.isFrozen())
                .accountId(card.getAccount().getId())
                .build();
    }
}
