package com.challet.shbankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "유저 중 나이, 성별이 같은 응답 DTO")
public record UserInfoMessageRequestDTO(

    @Schema(description = "전화번호 목록")
    List<String> phoneNumbers
){
}