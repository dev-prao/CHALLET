package com.challet.challetservice.domain.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@Document(indexName = "challenges")
@Schema(description = "챌린지 검색")
public record SearchedChallenge(

    @Id
    @Schema(description = "챌린지ID")
    String challengeId,

    @Field(type = FieldType.Keyword)
    @Schema(description = "챌린지 진행 상태", allowableValues = {"RECRUITING", "PROGRESSING", "END"})
    String status,

    @Field(type = FieldType.Keyword)
    @Schema(description = "챌린지 카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE", "SHOPPING"})
    String category,

    @Field(type = FieldType.Text)
    @Schema(description = "챌린지 제목")
    String title,

    @Schema(description = "챌린지 소비한도")
    Long spendingLimit,

    @Field(type = FieldType.Date, format = DateFormat.date, pattern = "yyyy-MM-dd")
    @Schema(description = "챌린지 시작날짜")
    LocalDate startDate,

    @Field(type = FieldType.Date, format = DateFormat.date, pattern = "yyyy-MM-dd")
    @Schema(description = "챌린지 마감날짜")
    LocalDate endDate,

    @Schema(description = "참여 가능 인원")
    Integer maxParticipants,

    @Schema(description = "현재 참여 인원")
    Integer currentParticipants,

    @Schema(description = "공개 여부 (비공개 : false, 공개 : true)")
    Boolean isPublic
) {

    public static SearchedChallenge fromChallenge(Challenge challenge) {
        return SearchedChallenge.builder()
            .challengeId(String.valueOf(challenge.getId()))
            .status(challenge.getStatus().toString())
            .category(challenge.getCategory().toString())
            .title(challenge.getTitle())
            .spendingLimit(challenge.getSpendingLimit())
            .startDate(challenge.getStartDate())
            .endDate(challenge.getEndDate())
            .maxParticipants(challenge.getMaxParticipants())
            .currentParticipants(1)
            .isPublic(challenge.getInviteCode() == null)
            .build();
    }
}
