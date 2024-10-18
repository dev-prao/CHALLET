package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "이체 요청 데이터 DTO")
public record AccountTransferRequestDTO(

    @Schema(description = "이체 은행")
    String bankCode,

    @Schema(description = "이체 계좌번호")
    String depositAccountNumber,

    @Schema(description = "이체 금액")
    Long transactionAmount
) {

}
