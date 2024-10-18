package com.challet.kbbankservice.domain.dto.response;

import com.challet.kbbankservice.domain.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
@Schema(description = "한달 결제 내역")
public record MonthlyTransactionHistoryDTO(

    @Schema(description = "은행 이름")
    String bankName,

    @Schema(description = "계좌 번호")
    String accountNumber,

    @Schema(description = "잔액")
    Long balance,

    @Schema(description = "거래 날짜 시간")
    LocalDateTime transactionDate,

    @Schema(description = "입금처")
    String deposit,

    @Schema(description = "출금처")
    String withdrawal,

    @Schema(description = "거래 후 잔액")
    Long transactionBalance,

    @Schema(description = "거래 금액")
    Long transactionAmount,

    @Schema(description = "카테고리")
    Category category
){

}