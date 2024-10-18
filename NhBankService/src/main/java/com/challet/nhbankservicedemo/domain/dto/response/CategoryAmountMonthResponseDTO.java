package com.challet.nhbankservicedemo.domain.dto.response;

import com.challet.nhbankservicedemo.domain.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "한달 카테고리별 합계")
public record CategoryAmountMonthResponseDTO (
    @Schema(description = "카테고리")
    Category category,

    @Schema(description = "합계")
    Long totalAmount
){
}