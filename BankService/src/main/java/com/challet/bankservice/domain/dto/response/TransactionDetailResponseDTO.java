package com.challet.bankservice.domain.dto.response;

import com.challet.bankservice.domain.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;


@Schema(description = "거래 상세 조회 응답 DTO")
public record TransactionDetailResponseDTO(

    @Schema(description = "거래 금액")
    Long transactionAmount,

    @Schema(description = "거래 일시")
    LocalDateTime transactionDatetime,

    @Schema(description = "입금처")
    String deposit,

    @Schema(description = "출금처")
    String withdrawal,

    @Schema(description = "거래 후 잔액")
    Long transactionBalance,

    @Schema(description = "카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE", "SHOPPING"})
    Category category
) {

}