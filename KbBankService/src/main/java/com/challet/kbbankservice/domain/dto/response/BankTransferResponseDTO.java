package com.challet.kbbankservice.domain.dto.response;

import com.challet.kbbankservice.domain.entity.KbBank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.NonNull;

@Builder
@Schema(description = "타 계좌 이체 후 전달 DTO")
public record BankTransferResponseDTO(

    @NonNull
    @Schema(description = "이체 받은 사용자 이름")
    String name,

    @Schema(description = "이체받은 계좌 번호")
    String accountNumber
) {
    public static BankTransferResponseDTO fromBankTransferResponseDTO(KbBank kbBank) {
        return BankTransferResponseDTO
            .builder()
            .name(kbBank.getName())
            .accountNumber(kbBank.getAccountNumber())
            .build();
    }
}
