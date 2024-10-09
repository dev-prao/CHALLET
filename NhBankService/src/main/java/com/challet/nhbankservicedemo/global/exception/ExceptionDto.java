package com.challet.nhbankservicedemo.global.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "에러 응답 DTO")
public class ExceptionDto {

    @Schema(description = "에러 코드")
    private String errorCode;

    @Schema(description = "에러 메세지")
    private String errorMessage;

}