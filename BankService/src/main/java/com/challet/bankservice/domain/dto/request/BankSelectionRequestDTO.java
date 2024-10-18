package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "마이데이터 연결을 선택한 은행리스트")
public record BankSelectionRequestDTO (

    @Schema(description = "유저 은행별 응답 데이터")
    List<BankSelectionDTO> selectedBanks
){
}
