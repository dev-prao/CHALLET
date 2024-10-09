package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.CommentRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.CommentResponseDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challet-service/shared-transactions")
@Tag(name = "SharedTransactionController", description = "공유 거래 내역 컨트롤러 - Authorize 필수")
public class SharedTransactionController {

    @Operation(summary = "공유 거래 내역 수정", description = "공유 거래 내역의 가격, 사진, 설명 추가 및 수정")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공유 거래 내역 수정 성공"),
            @ApiResponse(responseCode = "400", description = "공유 거래 내역 수정 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{id}")
    public ResponseEntity<String> sharedTransaction(@RequestHeader(value = "Authorization") String header,
                                                    @PathVariable("id") String id) {
        return null;
    }

    @Operation(summary = "공유 거래 내역 상세 조회", description = "공유 거래 내역 상세 정보를 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공유 거래 내역 상세 조회 성공"),
            @ApiResponse(responseCode = "400", description = "공유 거래 내역 상세 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{id}")
    public ResponseEntity<SharedTransactionDetailResponseDTO> getSharedTransactionDetail(@RequestHeader(value = "Authorization") String header,
                                                                                         @PathVariable("id") String id) {
        return null;
    }

    @Operation(summary = "공유 거래 내역 댓글 목록 조회", description = "공유 거래 내역에 달린 댓글 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 조회 성공"),
            @ApiResponse(responseCode = "400", description = "댓글 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComment(@RequestHeader(value = "Authorization") String header,
                                                               @PathVariable("id") String id) {
        return null;
    }

    @Operation(summary = "댓글 등록", description = "특정 공유 거래 내역에 댓글 달기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 등록 성공"),
            @ApiResponse(responseCode = "400", description = "댓글 등록 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @PostMapping("/{id}/comments")
    public ResponseEntity<String> registerComment(@RequestHeader(value = "Authorization") String header,
                                                                    @PathVariable("id") String id, @RequestBody CommentRegisterRequestDTO request) {
        return null;
    }

    @Operation(summary = "이모지 등록", description = "특정 공유 거래 내역에 이모지 달기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이모지 등록 성공"),
            @ApiResponse(responseCode = "400", description = "이모지 등록 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @PostMapping("/{id}/emoji")
    public ResponseEntity<String> registerEmoji(@RequestHeader(value = "Authorization") String header,
                                                                  @PathVariable("id") String id, @RequestBody EmojiRequestDTO request) {
        return null;
    }

    @Operation(summary = "이모지 수정", description = "특정 공유 거래 내역에 이모지 수정하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이모지 수정 성공"),
            @ApiResponse(responseCode = "400", description = "이모지 수정 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{id}/emoji")
    public ResponseEntity<String> updateEmoji(@RequestHeader(value = "Authorization") String header,
                                                                @PathVariable("id") String id, @RequestBody EmojiRequestDTO request) {
        return null;
    }

    // 공유 거래 내역 이모지 취소
    @Operation(summary = "이모지 취소", description = "특정 공유 거래 내역에 이모지 취소하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이모지 취소 성공"),
            @ApiResponse(responseCode = "400", description = "이모지 취소 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
            @Parameter(name = "id", description = "공유거래내역ID", in = ParameterIn.PATH)
    })
    @DeleteMapping("/{id}/emoji")
    public ResponseEntity<String> deleteEmoji(@RequestHeader(value = "Authorization") String header,
                                                                @PathVariable("id") String id) {
        return null;
    }

}
