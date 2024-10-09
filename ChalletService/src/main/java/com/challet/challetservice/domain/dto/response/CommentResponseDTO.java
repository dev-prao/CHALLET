package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "공유 거래 내역에 달린 댓글 조회 응답 DTO")
public class CommentResponseDTO {

    @Schema(description = "댓글 단 사람의 프로필 이미지")
    private String profileImage;

    @Schema(description = "댓글 단 사람의 닉네임")
    private String nickname;

    @Schema(description = "댓글 내용")
    private String content;

}
