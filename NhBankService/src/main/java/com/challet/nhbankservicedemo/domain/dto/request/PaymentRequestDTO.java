package com.challet.nhbankservicedemo.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "결제 요청 데이터 DTO")
public record PaymentRequestDTO(

    @Schema(description = "결제 금액")
    Long transactionAmount,

    @Schema(description = "결제 계좌")
    String accountNumber,

    @Schema(description = "결제 장소")
    String deposit
) {

}
