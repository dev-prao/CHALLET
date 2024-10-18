package com.challet.bankservice.domain.dto.response;

import com.challet.bankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.bankservice.domain.entity.ChalletBank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "계좌 이체 DTO")
public record BankTransferResponseDTO(

    @Schema(name = "이체자 이름")
    String name,

    @Schema(name = "입금 금액")
    Long amount,

    @Schema(name = "입금 계좌 번호")
    String depositAccountNumber
) {

    public static BankTransferResponseDTO fromDTO(ChalletBank fromBank,
        AccountTransferRequestDTO requestTransactionDTO) {

        return BankTransferResponseDTO
            .builder()
            .name(fromBank.getName())
            .amount(requestTransactionDTO.transactionAmount())
            .depositAccountNumber(requestTransactionDTO.depositAccountNumber())
            .build();
    }
}
