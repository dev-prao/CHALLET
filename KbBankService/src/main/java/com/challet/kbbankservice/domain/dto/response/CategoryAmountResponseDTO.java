package com.challet.kbbankservice.domain.dto.response;

import com.challet.kbbankservice.domain.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "카테고리별 합계")
public record CategoryAmountResponseDTO (

    @Schema(description = "카테고리")
    Category category, 
    
    @Schema(description = "합계")
    Long totalAmount,

    @Schema(description = "사람수")
    Long count
){
}
