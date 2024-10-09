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
@Schema(description = "로그인 요청 DTO")
public class UserLoginRequestDTO {

    @Schema(description = "가입한 전화번호")
    private String phoneNumber;

    @Schema(description = "가입한 비밀번호")
    private String password;

}
