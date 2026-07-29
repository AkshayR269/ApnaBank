package apnabank_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token; // The JWT Bearer Token
    private String tokenType; // "Bearer"
    private Long userId;
    private String fullName;
    private String email;
}
