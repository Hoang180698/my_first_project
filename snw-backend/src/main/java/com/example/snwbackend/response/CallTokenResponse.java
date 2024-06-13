package com.example.snwbackend.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CallTokenResponse {
    private String token;
    private String signature;
    private String signatureNonce;
}
