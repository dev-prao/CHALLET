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
@Schema(description = "회원가입 요청 DTO")
public class UserRegisterRequestDTO {

    @Schema(description = "전화번호")
    private String phoneNumber;

    @Schema(description = "간편비밀번호")
    private String password;

    @Schema(description = "닉네임")
    private String nickname;

    @Schema(description = "프로필 사진")
    private String profileImage;

    @Schema(description = "나이")
    private Integer age;

    @Schema(description = "성별")
    private String gender;

    @Schema(description = "이름")
    private String name;

}
