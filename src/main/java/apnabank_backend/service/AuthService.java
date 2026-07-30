package apnabank_backend.service;



import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import apnabank_backend.dto.AuthResponseDTO;
import apnabank_backend.dto.LoginRequestDTO;
import apnabank_backend.dto.RegisterRequestDTO;
import apnabank_backend.exception.BadRequestException;
import apnabank_backend.model.Account;
import apnabank_backend.model.AccountType;
import apnabank_backend.model.Card;
import apnabank_backend.model.Role;
import apnabank_backend.model.User;
import apnabank_backend.respository.AccountRepository;
import apnabank_backend.respository.CardRepository;
import apnabank_backend.respository.UserRepository;
import apnabank_backend.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;


    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new BadRequestException("Email is already registered!");
        }

        User user = User.builder()
        .fullName(request.getFullName())
        .email(request.getEmail().toLowerCase().trim())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(Role.ROLE_USER)
        .build();


        User savedUser = userRepository.save(user);


        Account checkingAccount = Account.builder()
                               .accountNumber(generateAccountNumber())
                               .accountType(AccountType.CHECKINGS)
                               .balance(new BigDecimal("5000"))
                               .currency("INR")
                               .user(savedUser)
                               .build();
        accountRepository.save(checkingAccount);

        Account savingsAccount = Account.builder()
                .accountNumber(generateAccountNumber())
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("12500.00"))
                .currency("USD")
                .user(savedUser)
                .build();
        accountRepository.save(savingsAccount);

        Card card = Card.builder()
                .cardNumber(generateCardNumber())
                .cardHolderName(savedUser.getFullName().toUpperCase())
                .expiryDate(LocalDate.now().plusYears(4))
                .cvv(generateCVV())
                .isFrozen(false)
                .account(checkingAccount)
                .build();
        cardRepository.save(card);

         String token = jwtTokenProvider.generateToken(savedUser.getEmail());
        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .build();

    }

    public AuthResponseDTO login(LoginRequestDTO request){
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim()).orElseThrow(()-> new BadRequestException("Invalid email or password"));

        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }


        // Helper generators
    private String generateAccountNumber() {
        return "ACC-" + (10000000 + new Random().nextInt(90000000));
    }
    private String generateCardNumber() {
        return "4532" + String.format("%012d", Math.abs(new Random().nextLong() % 1000000000000L));
    }
    private String generateCVV() {
        return String.format("%03d", new Random().nextInt(1000));
    }
}
