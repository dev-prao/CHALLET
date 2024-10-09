package com.challet.bankservice.domain.controller;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.PreviousMonthComparisonResultResponseDTO;
import com.challet.bankservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/bank-service/analysis")
@Tag(name = "TransactionAnalysisController", description="거래 내역 분석 컨트롤러")
public class TransactionAnalysisController {

    @GetMapping("/last-month-comparisons")
    @Operation(summary = "사용자 전월 비교 조회", description = "전화번호와 이번달 데이터를 통해 사용자 전체 계좌 중 전월 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "분석 성공"),
            @ApiResponse(responseCode = "400", description = "분석 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<List<PreviousMonthComparisonResultResponseDTO>> getComparisonWithPreviousMonth() {
        return null;
    }

    @GetMapping("/age-gender-comparisons")
    @Operation(summary = "성별,나이 분석 조회", description = "성별,나이,이번달 데이터를 통해 모든 사용자 계좌 전월 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "분석 성공"),
            @ApiResponse(responseCode = "400", description = "분석 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<List<PreviousMonthComparisonResultResponseDTO>> getTransactionAnalysisByGenderAndAge() {
        return null;
    }
}
