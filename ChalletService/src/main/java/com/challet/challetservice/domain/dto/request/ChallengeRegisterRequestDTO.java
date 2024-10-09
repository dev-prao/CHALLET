package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "챌린지 생성 요청 DTO")
public class ChallengeRegisterRequestDTO {

    @Schema(description = "챌린지 카테고리", allowableValues = {"DELIVERY","TRANSPORT","COFFEE","SHOPPING"})
    private String category;

    @Schema(description = "챌린지 제목")
    private String title;

    @Schema(description = "챌린지 소비한도")
    private Long spendingLimit;

    @Schema(description = "챌린지 시작날짜")
    private LocalDate startDate;

    @Schema(description = "챌린지 마감날짜")
    private LocalDate endDate;

    @Schema(description = "참여 가능 인원")
    private Integer maxParticipants;

    @Schema(description = "공개 여부 (비공개 : 0, 공개 : 1)")
    private Boolean isPublic;

}
