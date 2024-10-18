package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description="각 은행의 번호와 선택 여부")
public record BankSelectionDTO (

    @Schema(description = "은행 번호")
    String bankCode,

    @Schema(description = "마이데이터 연결 선택 여부")
    boolean isSelected
){

}
