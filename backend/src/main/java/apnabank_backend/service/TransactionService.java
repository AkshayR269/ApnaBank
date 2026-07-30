package apnabank_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import apnabank_backend.dto.TransactionDTO;
import apnabank_backend.exception.ResourceNotFoundException;
import apnabank_backend.exception.UnauthorizedAccessException;
import apnabank_backend.model.Account;
import apnabank_backend.model.Transaction;
import apnabank_backend.respository.AccountRepository;
import apnabank_backend.respository.TransactionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    public List<TransactionDTO> getAccountTransactions(Long accountId, Long currentUserId) {
        // Line 1: Fetch Account
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        // Line 2: Ownership Check
        if (!account.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You are not authorized to view transactions for this account!");
        }
        // Line 3: Fetch all debits/credits sorted by timestamp descending
        List<Transaction> transactions = transactionRepository.findAllByAccountIdOrderByTimestampDesc(accountId);
        // Line 4: Map entities to DTOs
        return transactions.stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
    }
    private TransactionDTO mapToTransactionDTO(Transaction txn) {
        return TransactionDTO.builder()
                .id(txn.getId())
                .referenceNumber(txn.getReferenceNumber())
                .sourceAccountNumber(txn.getSourceAccount() != null ? txn.getSourceAccount().getAccountNumber() : "External")
                .targetAccountNumber(txn.getTargetAccount() != null ? txn.getTargetAccount().getAccountNumber() : "External")
                .amount(txn.getAmount())
                .transactionType(txn.getTransactionType().name())
                .status(txn.getStatus().name())
                .description(txn.getDescription())
                .category(txn.getCategory())
                .timestamp(txn.getTimestamp())
                .build();
    }
}
