package com.challet.nhbankservicedemo.global.util;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Schema(description = "응답 데이터 전송 객체")
public class ResponseDto<T> {

//    @Schema(description = "HTTP 상태 코드", example = "200")
    private int status;
//    @Schema(description = "응답 메시지", example = "요청이 성공적으로 처리되었습니다.")
    private String message;
//    @Schema(description = "응답 데이터")
    private T data;
}