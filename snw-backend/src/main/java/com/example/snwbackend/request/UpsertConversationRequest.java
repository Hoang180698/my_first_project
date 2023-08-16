package com.example.snwbackend.request;

import com.example.snwbackend.entity.Like;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpsertConversationRequest {
    private List<Integer> userIds;
}
