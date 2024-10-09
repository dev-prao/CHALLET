package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "이체 요청 데이터 DTO")
public class AccountTransferRequestDTO {
    @Schema(description = "이체 은행")
    private String bankName;
    @Schema(description = "이체 계좌번호")
    private String accountNumber;
    @Schema(description = "이체 금액")
    private Long transactionAmount;
}
