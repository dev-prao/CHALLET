package com.challet.bankservice.domain.dto.response;

import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "결제 내용 DTO")
@Builder
public record PaymentHttpMessageResponseDTO(

    @Schema(description = "유저 전화번호")
    String phoneNumber,

    @Schema(description = "결제 금액")
    Long transactionAmount,

    @Schema(description = "결제 장소")
    String deposit,

    @Schema(description = "결제 카테고리")
    String category
) {

    public static PaymentHttpMessageResponseDTO ofPaymentMessage(String phoneNumber,
        PaymentResponseDTO paymentInfo) {
        return PaymentHttpMessageResponseDTO.builder()
            .phoneNumber(phoneNumber)
            .transactionAmount(paymentInfo.transactionAmount())
            .deposit(paymentInfo.deposit())
            .category(paymentInfo.category())
            .build();
    }
}