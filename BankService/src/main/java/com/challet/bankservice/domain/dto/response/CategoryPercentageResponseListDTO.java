package com.challet.bankservice.domain.dto.response;

import com.challet.bankservice.domain.dto.request.UserInfoMessageRequestDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "카테고리별 합계")
public record CategoryPercentageResponseListDTO(

    @Schema(description = "연령대")
    int age,

    @Schema(description = "성별")
    boolean gender,

    @Schema(description = "나의 카테고리 통계")
    List<CategoryPercentageResponseDTO> myCategoryList,

    @Schema(description = "카테고리 리스트")
    List<CategoryPercentageResponseDTO> categoryList
) {

    public static CategoryPercentageResponseListDTO fromCategoryList(UserInfoMessageRequestDTO userInfo,
        List<CategoryPercentageResponseDTO> myCategoryList,
        List<CategoryPercentageResponseDTO> categoryList) {
        return CategoryPercentageResponseListDTO
            .builder()
            .age(userInfo.age())
            .gender(userInfo.gender())
            .myCategoryList(myCategoryList)
            .categoryList(categoryList)
            .build();
    }
}
