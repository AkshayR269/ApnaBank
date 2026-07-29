package apnabank_backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardDTO {
    private Long id;
    private String cardNumber;
    private String cardHolderName;
    private LocalDate expiryDate;
    private String cvv;
    private boolean isFrozen;
    private Long accountId;
}
