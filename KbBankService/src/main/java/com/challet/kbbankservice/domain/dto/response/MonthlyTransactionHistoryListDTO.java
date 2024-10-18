package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "한달 결제 내역 리스트")
public record MonthlyTransactionHistoryListDTO(

    @Schema(description = "한달간의 결제 내역")
    List<MonthlyTransactionHistoryDTO> monthlyTransactions
){
    public static MonthlyTransactionHistoryListDTO from(List<MonthlyTransactionHistoryDTO> monthlyTransactions) {
        return MonthlyTransactionHistoryListDTO
            .builder()
            .monthlyTransactions(monthlyTransactions)
            .build();
    }
}
