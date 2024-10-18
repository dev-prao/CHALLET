package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "유저 중 나이, 성별이 같은 응답 DTO")
public record UserInfoMessageRequestDTO(

    @Schema(description = "나이대")
    int age,

    @Schema(description = "성별")
    boolean gender,

    @Schema(description = "전화번호 목록")
    List<String> phoneNumbers
){
}