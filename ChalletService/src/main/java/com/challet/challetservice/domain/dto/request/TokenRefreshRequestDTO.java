package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "토큰 재발급 요청 DTO")
public class TokenRefreshRequestDTO {

    @Schema(description = "리프레시 토큰")
    private String refreshToken;

}
