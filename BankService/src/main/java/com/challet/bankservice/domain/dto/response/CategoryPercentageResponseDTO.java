package com.challet.bankservice.domain.dto.response;

import com.challet.bankservice.domain.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "카테고리별 비율")
public record CategoryPercentageResponseDTO (
    @Schema(description = "카테고리")
    Category category,

    @Schema(description = "비율")
    double percentage,
    
    @Schema(description = "총합")
    Long totalMoney
){
    public static CategoryPercentageResponseDTO fromCategory(Category category, double percentage, Long totalMoney) {
        double roundedPercentage = Math.round(percentage * 100.0) / 100.0;

        return CategoryPercentageResponseDTO
            .builder()
            .category(category)
            .percentage(roundedPercentage)
            .totalMoney(totalMoney)
            .build();
    }
}