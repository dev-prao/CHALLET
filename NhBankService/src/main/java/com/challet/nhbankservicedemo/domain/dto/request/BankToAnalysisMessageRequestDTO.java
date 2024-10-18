package com.challet.nhbankservicedemo.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "분석 정보를 각 은행에 전달하는 DTO")
public record BankToAnalysisMessageRequestDTO(

    @Schema(description = "유저 정보")
    UserInfoMessageRequestDTO userInfo,

    @Schema(description = "조회 년도와 달")
    MonthlyTransactionRequestDTO requestDTO
){
    public List<String> getUserInfo() {
        return userInfo.phoneNumbers();
    }
    public int getYear(){
        return requestDTO.year();
    }
    public int getMonth(){
        return requestDTO.month();
    }
}