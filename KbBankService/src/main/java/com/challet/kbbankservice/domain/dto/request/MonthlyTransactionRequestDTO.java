package com.challet.kbbankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "한달 결제 내역 요청 DTO")
public record MonthlyTransactionRequestDTO (
    @Schema(description = "년도")
    int year,

    @Schema(description = "달")
    int month
){
    public static MonthlyTransactionRequestDTO fromDTO(int year, int month) {
        return MonthlyTransactionRequestDTO.builder().year(year).month(month).build();
    }
}