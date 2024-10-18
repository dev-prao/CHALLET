package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "은행 조회 응답 DTO")
public record AccountInfoResponseDTO(

    @Schema(description = "계좌 ID")
    Long id,

    @Schema(description = "은행 계좌 번호")
    String accountNumber,

    @Schema(description = "은행 계좌 잔액")
    Long accountBalance
) {

}
