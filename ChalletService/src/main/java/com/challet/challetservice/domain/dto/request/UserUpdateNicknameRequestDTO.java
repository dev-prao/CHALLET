package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "닉네임 수정 요청 DTO")
public class UserUpdateNicknameRequestDTO {

    @Schema(description = "새 닉네임")
    private String nickname;

}
