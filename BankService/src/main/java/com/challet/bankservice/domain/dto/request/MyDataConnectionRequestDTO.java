package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "이체 요청 데이터 DTO")
public class MyDataConnectionRequestDTO {
    @Schema(description = "mydate 연결 은행")
    private boolean isConnectionApproved;
    @Schema(description = "mydate 연결 은행")
    private List<String> banks;
}
