package com.challet.challetservice.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SmsRequestDTO(

    @NotBlank
    @Pattern(regexp = "^(010|011)\\d{7,8}$", message = "유효한 전화번호를 입력해주세요.")
    String phoneNumber

) {

}
