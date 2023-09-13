package com.example.snwbackend.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisterRequest {

    @NotEmpty
    @Email(message = "Email must be a valid email")
    private String email;

    @NotBlank
    @Length(min = 1, max = 25, message = "Name must be between 1 and 25 character")
    @Pattern(regexp = "^[^@!~`#$%^\\\\&*=+}{;'\":?/><|,.]*$", message = "No symbols or special chars in name")
    private String name;

    @Length(min = 3, max = 20, message = "Password must be between 3 and 20 character")
    private String password;
}
