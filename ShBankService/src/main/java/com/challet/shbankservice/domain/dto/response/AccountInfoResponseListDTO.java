package com.challet.shbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Schema(description = "SH은행의 계좌 조회 DTO")
@Builder
public record AccountInfoResponseListDTO(

    @Schema(description = "계좌 개수")
    int accountCount,

    @Schema(description = "사용자의 챌렛은행 조회")
    List<AccountInfoResponseDTO> accounts
) {

}
