package apnabank_backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import apnabank_backend.dto.AccountDTO;
import apnabank_backend.dto.DepositRequestDTO;
import apnabank_backend.dto.TransactionDTO;
import apnabank_backend.dto.TransferRequestDTO;
import apnabank_backend.exception.BadRequestException;
import apnabank_backend.exception.InsufficientFundsException;
import apnabank_backend.exception.ResourceNotFoundException;
import apnabank_backend.exception.UnauthorizedAccessException;
import apnabank_backend.model.Account;
import apnabank_backend.model.Transaction;
import apnabank_backend.model.TransactionStatus;
import apnabank_backend.model.TransactionType;
import apnabank_backend.respository.AccountRepository;
import apnabank_backend.respository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    @Transactional
    public TransactionDTO transferMoney(TransferRequestDTO request, Long currentUserId) {
        // Line 1: Fetch Source Account with Row-Level Lock
        Account sourceAccount = accountRepository.findByIdWithLock(request.getSourceAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found"));
        // Line 2: Ownership Validation
        if (!sourceAccount.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You do not own this source account!");
        }
        // Line 3: Fetch Target Account by Account Number
        Account targetAccount = accountRepository.findByAccountNumber(request.getTargetAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Target account number not found: " + request.getTargetAccountNumber()));
        // Line 4: Prevent Self-Transfer to Same Account
        if (sourceAccount.getId().equals(targetAccount.getId())) {
            throw new BadRequestException("Cannot transfer money to the exact same account!");
        }
        // Line 5: Validate Transfer Amount
        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer amount must be greater than zero!");
        }
        // Line 6: Check Balance Sufficiency
        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance! Available balance: $" + sourceAccount.getBalance());
        }
        // Line 7: Execute Balance Updates
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(amount));
        targetAccount.setBalance(targetAccount.getBalance().add(amount));
        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);
        // Line 8: Create Audit Ledger Entry
        Transaction transaction = Transaction.builder()
                .referenceNumber("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .sourceAccount(sourceAccount)
                .targetAccount(targetAccount)
                .amount(amount)
                .transactionType(TransactionType.TRANSFER)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription() != null ? request.getDescription() : "Transfer to " + targetAccount.getAccountNumber())
                .category("Transfer")
                .timestamp(LocalDateTime.now())
                .build();
        Transaction savedTxn = transactionRepository.save(transaction);
        return mapToTransactionDTO(savedTxn);
    }
    @Transactional
    public AccountDTO depositMoney(DepositRequestDTO request, Long currentUserId) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You do not own this account!");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be greater than zero!");
        }
        // Add funds
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);
        // Audit Record
        Transaction transaction = Transaction.builder()
                .referenceNumber("DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .sourceAccount(null) // Null source for cash deposit
                .targetAccount(account)
                .amount(request.getAmount())
                .transactionType(TransactionType.DEPOSIT)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription() != null ? request.getDescription() : "Direct Deposit")
                .category("Deposit")
                .timestamp(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);
        return mapToAccountDTO(account);
    }
    public List<AccountDTO> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::mapToAccountDTO)
                .collect(Collectors.toList());
    }
    private AccountDTO mapToAccountDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .build();
    }
    private TransactionDTO mapToTransactionDTO(Transaction txn) {
        return TransactionDTO.builder()
                .id(txn.getId())
                .referenceNumber(txn.getReferenceNumber())
                .sourceAccountNumber(txn.getSourceAccount() != null ? txn.getSourceAccount().getAccountNumber() : "N/A")
                .targetAccountNumber(txn.getTargetAccount() != null ? txn.getTargetAccount().getAccountNumber() : "N/A")
                .amount(txn.getAmount())
                .transactionType(txn.getTransactionType().name())
                .status(txn.getStatus().name())
                .description(txn.getDescription())
                .category(txn.getCategory())
                .timestamp(txn.getTimestamp())
                .build();
    }
}
