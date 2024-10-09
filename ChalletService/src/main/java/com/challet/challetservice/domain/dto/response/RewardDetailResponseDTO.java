package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "리워드 상세 조회 응답 DTO")
public class RewardDetailResponseDTO {

    @Schema(description = "챌린지 제목")
    private String title;

    @Schema(description = "챌린지 카테고리")
    private String category;

    @Schema(description = "챌린지 소비한도")
    private Long spendingLimit;

    @Schema(description = "챌린지 시작날짜")
    private LocalDate startDate;

    @Schema(description = "챌린지 마감날짜")
    private LocalDate endDate;

    @Schema(description = "실제 소비금액")
    private Long spendingAmount;

    @Schema(description = "리워드 종류(실패 : 0, 성공 : 1)")
    private Boolean type;

}
