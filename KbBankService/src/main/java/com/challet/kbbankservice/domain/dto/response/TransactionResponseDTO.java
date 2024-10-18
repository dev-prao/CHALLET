package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "간편 거래내역 조회 응답 DTO")
public record TransactionResponseDTO(

    @Schema(description = "거래 ID")
    Long id,

    @Schema(description = "거래 날짜 시간")
    LocalDateTime transactionDate,

    @Schema(description = "입금처")
    String deposit,

    @Schema(description = "출금처")
    String withdrawal,

    @Schema(description = "거래 후 잔액")
    Long transactionBalance,

    @Schema(description = "거래 금액")
    Long transactionAmount
) {

}