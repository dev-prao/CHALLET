package com.challet.kbbankservice.domain.controller;

import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDto;
import com.challet.kbbankservice.domain.dto.response.TransactionHistoryResponseDTO;
import com.challet.kbbankservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/kb-bank-service")
@Tag(name = "ChalletController", description="KB은행 컨트롤러")
public class KbBankController {

    @GetMapping("/")
    @Operation(summary = "국민은행 조회", description = "전화번호를 이용하여 국민은행 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseDTO> getAccountInfo(){
        return null;
    }

    @GetMapping("/account")
    @Operation(summary = "국민은행 계좌내역 조회", description = "계좌 ID를 통해 계좌내역 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<List<TransactionHistoryResponseDTO>> getAccountTransactions(){
        return null;
    }

    @GetMapping("/details")
    @Operation(summary = "극민은행 상세 거래 내역 조회", description = "거래내역 ID를 통해 상세 거래 내역 조회 내역")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계좌 상세 거래내역 조회 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 상세 거래내역 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionDetailResponseDto> getAccountTransactionDetails(){
        return null;
    }


    @GetMapping("/search")
    @Operation(summary = "극민은행 계좌 거래 내역 검색", description = "keyword, category를 통해 거래 내역 검색")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "검색 성공"),
            @ApiResponse(responseCode = "400", description = "검색 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<List<TransactionHistoryResponseDTO>> searchAccountTransactions(@RequestParam String keyword,
                                                                                  @RequestParam String category){
        return null;
    }

}
