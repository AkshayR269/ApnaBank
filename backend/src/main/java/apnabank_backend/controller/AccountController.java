package apnabank_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apnabank_backend.dto.AccountDTO;
import apnabank_backend.dto.DepositRequestDTO;
import apnabank_backend.dto.TransactionDTO;
import apnabank_backend.dto.TransferRequestDTO;
import apnabank_backend.respository.UserRepository;
import apnabank_backend.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final UserRepository userRepository;
    // Line 1: Get Current User's Accounts (Checking & Savings)
    @GetMapping
    public ResponseEntity<List<AccountDTO>> getUserAccounts(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromDetails(userDetails);
        List<AccountDTO> accounts = accountService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }
    // Line 2: Execute Money Transfer Endpoint
    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transferMoney(@Valid @RequestBody TransferRequestDTO request,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromDetails(userDetails);
        TransactionDTO transaction = accountService.transferMoney(request, userId);
        return ResponseEntity.ok(transaction);
    }
    // Line 3: Execute Deposit Endpoint
    @PostMapping("/deposit")
    public ResponseEntity<AccountDTO> depositMoney(@Valid @RequestBody DepositRequestDTO request,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromDetails(userDetails);
        AccountDTO updatedAccount = accountService.depositMoney(request, userId);
        return ResponseEntity.ok(updatedAccount);
    }
    // Helper to resolve User ID from authenticated principal
    private Long getUserIdFromDetails(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow()
                .getId();
    }
}
