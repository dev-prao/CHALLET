package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "카테고리별 합계")
public record CategoryAmountResponseListDTO(
    
    @Schema(description = "카테고리 리스트")
    List<CategoryAmountResponseDTO> categoryList
){
    public static CategoryAmountResponseListDTO from(List<CategoryAmountResponseDTO> categoryList){
        return CategoryAmountResponseListDTO
            .builder()
            .categoryList(categoryList)
            .build();
    }
}
