package apnabank_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apnabank_backend.dto.TransactionDTO;
import apnabank_backend.respository.UserRepository;
import apnabank_backend.service.TransactionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final UserRepository userRepository;
    // Line 1: Get Transactions for an Account
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDTO>> getAccountTransactions(@PathVariable Long accountId,
                                                                      @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        List<TransactionDTO> transactions = transactionService.getAccountTransactions(accountId, userId);
        return ResponseEntity.ok(transactions);
    }
}
