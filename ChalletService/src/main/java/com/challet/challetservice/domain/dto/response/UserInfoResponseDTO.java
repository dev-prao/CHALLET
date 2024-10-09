package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "유저 정보 조회 응답 DTO")
public class UserInfoResponseDTO {

    @Schema(description = "프로필 사진 url")
    private String profileImage;

    @Schema(description = "닉네임")
    private String nickname;

}
