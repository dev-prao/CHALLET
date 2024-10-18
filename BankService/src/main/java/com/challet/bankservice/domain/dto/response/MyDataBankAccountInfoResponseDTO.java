package com.challet.bankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "MyData를 연결할 은행별 계좌 정보를 포함한 응답 DTO")
public record MyDataBankAccountInfoResponseDTO(

    @Schema(description = "KB 은행 계좌 정보")
    AccountInfoResponseListDTO kbBanks,

    @Schema(description = "NH 은행 계좌 정보")
    AccountInfoResponseListDTO nhBanks,

    @Schema(description = "SH 은행 계좌 정보")
    AccountInfoResponseListDTO shBanks
) {
}