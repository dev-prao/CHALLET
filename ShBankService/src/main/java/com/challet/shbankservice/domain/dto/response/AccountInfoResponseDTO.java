package com.challet.shbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "은행 조회 응답 DTO")
public class AccountInfoResponseDTO {
    @Schema(description = "계좌 ID")
    private Long id;
    @Schema(description = "은행 계좌 번호")
    private String accountNumber;
    @Schema(description = "은행 계좌 잔액")
    private String accountBalance;
}