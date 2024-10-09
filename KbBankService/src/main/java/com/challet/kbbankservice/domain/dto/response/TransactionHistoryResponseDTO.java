package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "챌렛계좌 내역 조회 응답 DTO")
public class TransactionHistoryResponseDTO {
    @Schema(description = "거래내역 ID")
    private long id;
    @Schema(description = "거래금액")
    private long transactionAmount;
    @Schema(description = "잔액")
    private long balance;
    @Schema(description = "거래일시")
    private LocalDateTime transactionDate;
    @Schema(description = "거래카테고리", allowableValues = {"DELIVERY","TRANSPORT","COFFEE","SHOPPING"})
    private String category;
}
