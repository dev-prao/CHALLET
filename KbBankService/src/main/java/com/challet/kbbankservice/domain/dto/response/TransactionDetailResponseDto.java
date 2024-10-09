package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "거래 상세 조회 응답 DTO")
public class TransactionDetailResponseDto {
    @Schema(description = "거래 금액")
    private Long transactionAmount;
    @Schema(description = "거래 일시")
    private LocalDateTime transactionDatetime;
    @Schema(description = "입금처")
    private String deposit;
    @Schema(description = "출금처")
    private String withdrawal;
    @Schema(description = "거래 후 잔액")
    private Long transactionBalance;
    @Schema(description = "카테고리", allowableValues = {"DELIVERY","TRANSPORT","COFFEE","SHOPPING"})
    private String category;
}
