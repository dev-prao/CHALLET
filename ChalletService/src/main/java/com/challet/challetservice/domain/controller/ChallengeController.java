package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.ChallengeJoinRequestDTO;
import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.ChallengeDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challet-service/challenges")
@Tag(name = "ChallengeController", description = "챌린지 관련 Controller - Authorize 필수")
public class ChallengeController {

    @Operation(summary = "챌린지 생성", description = "챌린지 정보를 입력하여 챌린지 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "챌린지 생성 성공"),
            @ApiResponse(responseCode = "400", description = "챌린지 생성 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @PostMapping()
    public ResponseEntity<String> createChallenge(@RequestHeader(value = "Authorization") String header, @RequestBody ChallengeRegisterRequestDTO request) {
        return null;
    }

    @Operation(summary = "내 챌린지 조회", description = "내가 참여한 챌린지 목록 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 챌린지 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "내 챌린지 목록 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @GetMapping("/my-challenges")
    public ResponseEntity<List<ChallengeDetailResponseDTO>> getMyChallenges(@RequestHeader(value = "Authorization") String header) {
        return null;
    }

    @Operation(summary = "챌린지 검색", description = "모집중인 챌린지 중 검색어와 카테고리로 챌린지 검색" +
            "검색어와 카테고리 모두 주어진 값이 없다면 전체조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "챌린지 검색 성공"),
            @ApiResponse(responseCode = "400", description = "챌린지 검색 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "keyword", description = "검색어", in = ParameterIn.QUERY),
            @Parameter(name = "category", description = "카테고리", in = ParameterIn.QUERY),
    })
    @GetMapping()
    public ResponseEntity<List<ChallengeDetailResponseDTO>> searchChallenges(@RequestHeader(value = "Authorization") String header,
                                                                             @Param(value = "keyword")String keyword, @Param(value = "category")String category) {
        return null;
    }

    @Operation(summary = "챌린지 정보 상세 조회", description = "챌린지ID로 챌린지 정보 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "챌린지 상세 조회 성공"),
            @ApiResponse(responseCode = "400", description = "챌린지 상세 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "챌린지ID", in = ParameterIn.PATH),
    })
    @GetMapping("/{id}")
    public ResponseEntity<ChallengeDetailResponseDTO> getChallengeDetail(@RequestHeader(value = "Authorization") String header, @PathVariable("id") String id) {
        return null;
    }

    @Operation(summary = "챌린지 참여 신청", description = "챌린지 참여 신청하는 요청" +
            "공개 챌린지의 경우 초대코드는 null")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "챌린지 참여 신청 성공"),
            @ApiResponse(responseCode = "400", description = "챌린지 참여 신청 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "챌린지ID", in = ParameterIn.PATH),
    })
    @PostMapping("/{id}")
    public ResponseEntity<String> joinChallenge(@RequestHeader(value = "Authorization") String header, @PathVariable("id") String id,
                                                @RequestBody ChallengeJoinRequestDTO request) {
        return null;
    }

    @Operation(summary = "챌린지 내 공유 거래 내역 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공유 거래 내역 조회 성공"),
            @ApiResponse(responseCode = "400", description = "공유 거래 내역 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "챌린지ID", in = ParameterIn.PATH),
    })
    @GetMapping("/{id}/shared-transactions")
    public ResponseEntity<List<SharedTransactionDetailResponseDTO>> getSharedTransactions(@RequestHeader(value = "Authorization") String header, @PathVariable("id") String id) {
        return null;
    }

    @Operation(summary = "챌린지 내 공유 거래 내역 수동 등록")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공유 거래 내역 수동 등록 성공"),
            @ApiResponse(responseCode = "400", description = "공유 거래 내역 수동 등록 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "챌린지ID", in = ParameterIn.PATH),
    })
    @PostMapping("/{id}/shared-transactions")
    public ResponseEntity<String> registerSharedTransactions(@RequestHeader(value = "Authorization") String header, @PathVariable("id") String id,
                                                             @RequestBody SharedTransactionRegisterRequestDTO request){
        return null;
    }
}
