package com.example.snwbackend.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.modelmapper.internal.bytebuddy.implementation.bind.annotation.Empty;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UpdateInfoUserRequest {

    @Length(min = 1, max = 25)
    private String name;

    @Length(max = 12)
    @Pattern(regexp = "(^[0-9]+$|^$)")
    private String phone;

    private String address;

    @Length(max = 200)
    private String biography;

    private String gender;

    @Pattern(regexp = "^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$")
    private String birthday;
}
