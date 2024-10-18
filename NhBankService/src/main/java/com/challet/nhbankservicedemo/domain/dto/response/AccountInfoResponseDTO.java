package com.challet.nhbankservicedemo.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "농협은행 조회 응답 DTO")
public record AccountInfoResponseDTO(

    @Schema(description = "농협은행 계좌 ID")
    Long id,

    @Schema(description = "농협은행 계좌 번호")
    String accountNumber,

    @Schema(description = "잔액")
    Long accountBalance
) {

}
