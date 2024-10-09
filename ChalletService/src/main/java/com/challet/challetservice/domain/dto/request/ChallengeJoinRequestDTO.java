package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "챌린지 참여 신청 요청 DTO")
public class ChallengeJoinRequestDTO {

    @Schema(description = "챌린지 공개 여부 (공개 : 1, 비공개 : 0)")
    private Boolean isPublic;

    @Schema(description = "초대코드")
    private String inviteCode;

}
