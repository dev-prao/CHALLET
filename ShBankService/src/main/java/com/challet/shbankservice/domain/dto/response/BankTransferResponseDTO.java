package com.challet.shbankservice.domain.dto.response;

import com.challet.shbankservice.domain.entity.ShBank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "타 계좌 이체 후 전달 DTO")
public record BankTransferResponseDTO(

    @Schema(description = "이체 받은 사용자 이름")
    String name,

    @Schema(description = "이체받은 계좌 번호")
    String accountNumber
) {
    public static BankTransferResponseDTO fromBankTransferResponseDTO(ShBank shBank) {
        return BankTransferResponseDTO
            .builder()
            .name(shBank.getName())
            .accountNumber(shBank.getAccountNumber())
            .build();
    }
}