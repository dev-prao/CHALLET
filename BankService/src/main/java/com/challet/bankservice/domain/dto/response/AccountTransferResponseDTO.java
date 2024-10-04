package com.challet.bankservice.domain.dto.response;

import com.challet.bankservice.domain.dto.request.BankTransferRequestDTO;
import com.challet.bankservice.domain.entity.ChalletBank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "계좌 이체 후 응답 DTO")
public record AccountTransferResponseDTO(

    @Schema(description = "id")
    Long id,

    @Schema(description = "출금계좌 유저 이름")
    String depositAccountName,

    @Schema(description = "내 계좌")
    String myAccountNumber,

    @Schema(description = "카테고리")
    String category,

    @Schema(description = "잔액")
    Long balance,

    @Schema(description = "출금 금액")
    Long amount,

    @Schema(description = "출금 계좌 번호")
    String depositNumber
) {

    public static AccountTransferResponseDTO fromTransferInfo(Long id ,ChalletBank fromBank,
        ChalletBank toBank, Long amount, String category) {
        return AccountTransferResponseDTO.builder()
            .id(id)
            .depositAccountName(toBank.getName())
            .myAccountNumber(fromBank.getAccountNumber())
            .category(category)
            .balance(fromBank.getAccountBalance())
            .amount(amount*-1)
            .depositNumber(toBank.getAccountNumber())
            .build();
    }

    public static AccountTransferResponseDTO fromExternalTransferInfo(Long id ,ChalletBank fromBank,
        BankTransferRequestDTO toBank, Long amount, String category) {
        return AccountTransferResponseDTO.builder()
            .id(id)
            .depositAccountName(toBank.name())
            .myAccountNumber(fromBank.getAccountNumber())
            .category(category)
            .balance(fromBank.getAccountBalance())
            .amount(amount*-1)
            .depositNumber(toBank.accountNumber())
            .build();
    }
}
