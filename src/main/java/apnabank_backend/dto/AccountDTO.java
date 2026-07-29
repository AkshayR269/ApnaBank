package apnabank_backend.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private Long id;
    private String accountNumber;
    private String accountType; // "CHECKING" or "SAVINGS"
    private BigDecimal balance;
    private String currency;
}
