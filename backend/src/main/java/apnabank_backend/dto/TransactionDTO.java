package apnabank_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private String referenceNumber;
    private String sourceAccountNumber;
    private String targetAccountNumber;
    private BigDecimal amount;
    private String transactionType; // "TRANSFER", "DEPOSIT", "WITHDRAWAL"
    private String status;          // "COMPLETED", "FAILED"
    private String description;
    private String category;
    private LocalDateTime timestamp;
}
