package com.example.snwbackend.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ExchangeTokenRequest {
   private String code;
   private String clientId;
   private String clientSecret;
   private String redirectUri;
   private String grantType;
}
