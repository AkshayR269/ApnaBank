package apnabank_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apnabank_backend.dto.CardDTO;
import apnabank_backend.respository.UserRepository;
import apnabank_backend.service.CardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;
    private final UserRepository userRepository;
    // Line 1: Get Card Linked to an Account
    @GetMapping("/account/{accountId}")
    public ResponseEntity<CardDTO> getCardByAccount(@PathVariable Long accountId,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        CardDTO card = cardService.getCardByAccountId(accountId, userId);
        return ResponseEntity.ok(card);
    }
    // Line 2: Freeze / Unfreeze Card Toggle
    @PutMapping("/{cardId}/toggle-freeze")
    public ResponseEntity<CardDTO> toggleCardFreeze(@PathVariable Long cardId,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        CardDTO updatedCard = cardService.toggleCardFreeze(cardId, userId);
        return ResponseEntity.ok(updatedCard);
    }
}
