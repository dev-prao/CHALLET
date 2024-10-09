package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "내 리워드 조회 응답 DTO")
public class MyRewadsListResponseDTO {

    @Schema(description = "리워드ID")
    private Integer id;

    @Schema(description = "리워드 종류 (실패 : 0, 성공 : 1)")
    private Boolean type;

}
