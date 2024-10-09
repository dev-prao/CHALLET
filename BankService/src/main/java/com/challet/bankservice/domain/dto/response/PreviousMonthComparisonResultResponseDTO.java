package com.challet.bankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "전월 비교 분석 결과 응답 DTO")
public class PreviousMonthComparisonResultResponseDTO {

    @Schema(description = "카테고리 이름(배달, 교통, 쇼핑, 커피)")
    private String category;

    @Schema(description = "해당 카테고리의 비율")
    private double value;
}
