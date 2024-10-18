package com.challet.shbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "거래 내역 조회 DTO")
public record TransactionResponseListDTO(

    @Schema(description = "총 거래 수")
    Long transactionCount,

    @Schema(description = "계좌 잔액")
    Long accountBalance,

    @Schema(description = "간편 거래 내역")
    List<TransactionResponseDTO> transactionResponseDTO
) {

}
