package com.challet.kbbankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "계좌 이체로 인한 입금 요청 DTO")
public record AccountTransferRequestDTO (
    
    @Schema(name = "이체자 이름")
    String name,
    
    @Schema(name = "입금 금액")
    Long amount,
    
    @Schema(name = "입금 계좌 번호")
    String depositAccountNumber
){

}
