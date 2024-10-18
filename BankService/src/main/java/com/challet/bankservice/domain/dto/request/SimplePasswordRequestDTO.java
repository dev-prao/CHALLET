package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "간편 결제 비밀번호")
public record SimplePasswordRequestDTO(
    String password
){
}
