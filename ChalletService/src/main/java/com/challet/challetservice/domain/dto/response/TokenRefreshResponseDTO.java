package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "토큰 재발급 응답 DTO")
public class TokenRefreshResponseDTO {

    @Schema(description = "새로 발급 받은 액세스 토큰")
    private String accessToken;

}
