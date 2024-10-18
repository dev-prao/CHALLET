package com.challet.nhbankservicedemo.domain.dto.response;

import com.challet.nhbankservicedemo.domain.entity.NhBankTransaction;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "결제 내용 DTO")
@Builder
public record PaymentResponseDTO(
    @Schema(description = "결제내역 id")
    Long id,

    @Schema(description = "결제 금액")
    Long transactionAmount,

    @Schema(description = "결제 장소")
    String deposit,

    @Schema(description = "결제 카테고리")
    String category
) {
    public static PaymentResponseDTO fromPaymentResponseDTO(NhBankTransaction transaction) {

        return PaymentResponseDTO.builder()
            .id(transaction.getId())
            .transactionAmount(transaction.getTransactionAmount())
            .deposit(transaction.getDeposit())
            .category(String.valueOf(transaction.getCategory()))
            .build();
    }
}
