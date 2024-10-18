package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "이체 요청 데이터 DTO")
public record MyDataConnectionRequestDTO(

    @Schema(description = "mydate 연결 은행")
    boolean isConnectionApproved,

    @Schema(description = "mydate 연결 은행")
    List<String> banks
) {

}
