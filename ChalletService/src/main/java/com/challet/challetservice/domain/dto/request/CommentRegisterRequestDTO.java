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
@Schema(description = "공유 거래 내역에 댓글 달기 요청 DTO")
public class CommentRegisterRequestDTO {

    @Schema(description = "댓글 내용")
    private String content;

}
